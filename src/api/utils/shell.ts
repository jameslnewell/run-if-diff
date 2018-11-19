import {spawn} from 'child_process';

class ExecError extends Error {
  constructor(
    public readonly code: number,
    public readonly stdout: string,
    public readonly stderr: string
  ) {
    super('');
  }
}

class SpawnError extends Error {
  constructor(public readonly code: number) {
    super('');
  }
}

export function exec(
  cmd: string,
  args: string[],
  options: {cwd?: string} = {}
): Promise<{code: number; stdout: string; stderr: string}> {
  let stdout = '';
  let stderr = '';
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options);
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
      if (code === 0) {
        resolve({code, stdout, stderr});
      } else {
        reject(new ExecError(code, stdout, stderr));
      }
    });
  });
}

export function passthru(
  cmd: string,
  args: string[],
  options: {cwd?: string} = {}
): Promise<{code: number}> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {...options, stdio: 'inherit'});
    child.on('error', error => {
      reject(error);
    });
    child.on('close', code => {
      console.log('CLOSE');
      if (code === 0) {
        resolve({code});
      } else {
        reject(new SpawnError(code));
      }
    });
  });
}
