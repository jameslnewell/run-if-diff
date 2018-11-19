// tslint:disable no-console
import * as debug from 'debug';
import * as mm from 'micromatch';
import {diff, getDefaultRef} from './utils/git';
import {passthru} from './utils/shell';

export interface Options {
  since?: string;
  files?: string[];
}

const log = debug('run-if-diff');

function formatFiles(files: string[]) {
  if (files.length === 0) {
    return 'none';
  }
  return `\n\t- ${files.join('\n\t- ')}`;
}

export default async function(
  cmd: string,
  args: string[],
  options: Options
): Promise<void> {
  const {since, files = []} = options;

  const ref = since ? since : await getDefaultRef();
  log(`ref: %s`, ref);
  log(`cmd: ${cmd} ${args.join(' ')}`);

  const changedFiles = await diff(ref);
  log(`${changedFiles.length} files changed: ${formatFiles(changedFiles)}\n`);

  const matchedFiles = mm(changedFiles, files);
  log(`${matchedFiles.length} files matched: ${formatFiles(matchedFiles)}\n`);

  if (matchedFiles.length) {
    log(`the command was executed`);
    await passthru(cmd, args);
  } else {
    log(`the command was skipped`);
  }
}
