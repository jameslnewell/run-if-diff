// tslint:disable no-console
import * as debug from 'debug';
import * as mm from 'micromatch';
import {diff, getLastCommit} from './utils/git';
import {passthru} from './utils/shell';

export interface Options {
  since?: string;
  patterns?: string[];
}

const log = debug('run-if-diff');

export default async function(
  cmd: string,
  args: string[],
  options: Options
): Promise<number> {
  const {since, patterns} = options;

  const ref = since ? since : await getLastCommit();
  log(`git ref: %s`, ref);

  const files = await diff(ref);
  log(`diff count: %s files`, files.length);

  const matches = mm(files, patterns);
  log(`match count: %s files`, matches.length);

  if (matches.length) {
    const {code} = await passthru(cmd, args);
    return code;
  } else {
    return 0;
  }
}
