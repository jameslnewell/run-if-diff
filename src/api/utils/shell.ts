import {spawn} from 'child_process';

export function exec(
  cmd: string,
  args: string[]
): Promise<{code: number; stdout: string; stderr: string}> {
  let stdout = '';
  let stderr = '';
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    child.stdout.on('data', data => {
      stdout += data;
    });
    child.stderr.on('data', data => {
      stderr += data;
    });
    child.on('error', error => {
      reject(error);
    });
    child.on('close', code => {
      resolve({code, stdout: stdout.trim(), stderr: stderr.trim()});
    });
  });
}

export function passthru(cmd: string, args: string[]): Promise<{code: number}> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {stdio: 'inherit'});
    child.on('error', error => {
      reject(error);
    });
    child.on('close', code => {
      resolve({code});
    });
  });
}
