import { exec } from "./shell";

export type DiffStatus = 'added' | 'changed' | 'deleted';

export async function diff(ref?: string): Promise<string[]> {
  const cmd = 'git';
  const args = ['diff', '--name-only'];
  if (ref) {
    args.push(ref);
  }
  const {code, stdout, stderr} = await exec(cmd, args);
  if (code === 0) {
    return stdout.split('\n').filter(file => file !== '');
  } else {
    throw new Error(stderr);
  }
}
