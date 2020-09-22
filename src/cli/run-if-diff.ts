#!/usr/bin/env node
/* tslint:disable: no-console no-var-requires */

import debug from 'debug';
import yargs from 'yargs';
import {diff, passthru, PassThroughError} from '../api';
import {Options, since, file} from './utils/options';
import {diffResult as logDiffResult} from './utils/log';

const log = debug('run-if-diff');

(async () => {
  const argv = yargs
    .strict()
    .help()
    .usage('$0', 'run a command if files have changed', {since, file})
    .argv as unknown as Options;

  const [cmd, ...args] = argv._;

  if (!cmd) {
    console.error('No command specified.');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await diff({
      since: argv.since,
      files: Array.isArray(argv.file) ? argv.file : [argv.file],
    });
    logDiffResult(log, result);
    if (result.matched.length) {
      log(`spawning: ${cmd} ${args.join(' ')}`);
      await passthru(cmd, args);
    }
  } catch (error) {
    if (error instanceof PassThroughError) {
      log(`exit code: ${error.code}`);
      process.exitCode = error.code;
    } else {
      log(`exit code: 1`);
      console.error(error);
      process.exitCode = 1;
    }
  }
})();
