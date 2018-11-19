import * as debug from 'debug';
import * as shell from './shell';

const log = debug('run-if-diff');

async function hasOneOrMoreTags() {
  console.log('get tags');
  const {stdout} = await shell.exec('git', ['tag']);
  console.log('got tags');
  return stdout.trim() !== '';
}

async function getMostRecentTag() {
  const {stdout} = await shell.exec('git', [
    'describe',
    '--tags',
    '--abbrev=0'
  ]);
  return stdout.split('\n')[0];
}

async function getFirstCommit() {
  const {stdout} = await shell.exec('git', [
    'rev-list',
    '--max-parents=0',
    'HEAD'
  ]);
  return stdout.split('\n')[0];
}

export async function getDefaultRef(): Promise<string> {
  const hasTags = await hasOneOrMoreTags();
  if (hasTags) {
    log('the repo has tags, defaulting to the most recent tag');
    return await getMostRecentTag();
  } else {
    log('the repo has no tags, defaulting to the first commit');
    return await getFirstCommit();
  }
}

export async function diff(ref?: string): Promise<string[]> {
  const cmd = 'git';
  const args = ['diff', '--name-only'];
  if (ref) {
    args.push(ref);
  }
  const {code, stdout, stderr} = await shell.exec(cmd, args);
  return stdout.split('\n').filter(file => file !== '');
}
