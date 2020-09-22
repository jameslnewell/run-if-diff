// tslint:disable max-classes-per-file
import { spawn } from "child_process";

export class ExecError extends Error {
  constructor(
    readonly cmd: string,
    readonly code: number,
    readonly stdout: string,
    readonly stderr: string
  ) {
    super(
      `exec() failed:\n   cmd=${cmd}\n  code=${code}\n  ${stdout}\n  ${stderr}`
    );
  }
}

export class PassThroughError extends Error {
  constructor(readonly cmd: string, readonly code: number) {
    super(`passthru() failed:\n   cmd=${cmd}\n  code=${code}`);
  }
}

export function exec(
  cmd: string,
  args: string[],
  options: { cwd?: string } = {}
): Promise<{ code: number; stdout: string; stderr: string }> {
  let stdout = "";
  let stderr = "";
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options);
    child.stdout.on("data", (data) => {
      stdout += data;
    });
    child.stderr.on("data", (data) => {
      stderr += data;
    });
    child.on("error", (error) => {
      reject(error);
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ code, stdout, stderr });
      } else {
        reject(new ExecError([cmd, ...args].join(" "), code, stdout, stderr));
      }
    });
  });
}

export function passthru(
  cmd: string,
  args: string[],
  options: { cwd?: string } = {}
): Promise<{ code: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { ...options, stdio: "inherit" });
    child.on("error", (error) => {
      reject(error);
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ code });
      } else {
        reject(new PassThroughError([cmd, ...args].join(" "), code));
      }
    });
  });
}
