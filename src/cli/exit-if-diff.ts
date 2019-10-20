#!/usr/bin/env node
/* tslint:disable: no-console no-var-requires */

import * as debug from 'debug';
import * as yargs from 'yargs';
import {diff} from '../api';
import {Options, since, file} from './utils/options';
import {diffResult as logDiffResult} from './utils/log';

const log = debug('exit-if-diff');

(async () => {
  const argv = (yargs
    .strict()
    .help()
    .usage('$0', 'exit if files have changed', {since, file})
    .argv as any) as Options;

  try {
    const result = await diff({
      since: argv.since,
      files: Array.isArray(argv.file) ? argv.file : [argv.file]
    });
    logDiffResult(log, result);
    if (result.matched.length) {
      log(`exit code: 128`);
      process.exitCode = 128;
    } else {
      log(`exit code: 0`);
      process.exitCode = 0;
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
