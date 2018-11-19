import {exec} from './shell';

export type DiffStatus = 'added' | 'changed' | 'deleted';

export async function getLastCommit(): Promise<string> {
  const {code: hasTagCode} = await exec('git', ['tag']);
  if (hasTagCode === 0) {
    const {code, stdout} = await exec('git', [
      'describe',
      '--tags',
      '--abbrev=0'
    ]);
    if (code === 0) {
      return stdout.split('\n')[0];
    }
  } else {
    const {code, stdout} = await exec('git', [
      'rev-list',
      '--max-parents=0',
      'HEAD'
    ]);
    if (code === 0) {
      return stdout.split('\n')[0];
    }
  }
  throw new Error('Unable to retrieve a ref.');
}

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
