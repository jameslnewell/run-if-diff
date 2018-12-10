#!/usr/bin/env node
/* tslint:disable: no-console no-var-requires */

import * as debug from 'debug';
import * as yargs from 'yargs';
import {diff, passthru, PassThroughError} from '../api';
import * as options from './utils/options';
import {diffResult as logDiffResult} from './utils/log';

const log = debug('run-if-diff');

(async () => {
  const argv = yargs
    .strict()
    .help()
    .usage('$0', 'run a command if files have changed', options).argv;

  const [cmd, ...args] = argv._;

  if (!cmd) {
    console.error('No command specified.');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await diff({
      since: argv.since,
      files: [].concat(argv.file)
    });
    logDiffResult(log, result);
    if (result.matched.length) {
      log(`spawning: ${cmd} ${args.join(' ')}`);
      await passthru(cmd, args);
    }
  } catch (error) {
    if (error instanceof PassThroughError) {
      process.exitCode = error.code;
    } else {
      console.error(error);
      process.exitCode = 1;
    }
  }
})();
