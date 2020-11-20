#!/usr/bin/env node
/* tslint:disable: no-console no-var-requires */
import { spawn } from "child_process";
import yargs from "yargs";
import { diff } from "../api";
import {
  CLIOptions,
  options,
  getAPIOptionsFromCLIOptions,
} from "./utils/options";
import * as debug from "./utils/debug";

class PassThroughError extends Error {
  constructor(readonly cmd: string, readonly code: number) {
    super(`passthru() failed:\n   cmd=${cmd}\n  code=${code}`);
    Object.setPrototypeOf(this, PassThroughError.prototype);
  }
}

function passthru(
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

(async () => {
  const argv = (yargs
    .strict()
    .help()
    .usage("$0", "run a command if files have changed", options)
    .argv as unknown) as CLIOptions;

  const [cmd, ...args] = argv._;

  if (!cmd) {
    debug.log(`exiting with 1`);
    console.error("No command specified.");
    process.exitCode = 1;
    return;
  }

  try {
    const { count } = await diff(getAPIOptionsFromCLIOptions(argv));
    if (count > 0) {
      debug.log(`spawning: ${cmd} ${args.join(" ")}`);
      await passthru(cmd, args);
    }
  } catch (error) {
    if (error instanceof PassThroughError) {
      debug.log(`exiting with ${error.code}`);
      process.exitCode = error.code;
    } else {
      debug.log(`exiting with 1`);
      console.error(error);
      process.exitCode = 1;
    }
  }
})();
