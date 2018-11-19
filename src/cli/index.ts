#!/usr/bin/env node
/* tslint:disable: no-console no-var-requires */

import * as yargs from 'yargs';
import runIfDiff from '../api';
import {PassThroughError} from '../api/utils/shell';

(async () => {
  const argv = yargs
    .strict()
    .help()
    .usage('$0 <args...>', 'runs a command if the files are different', {
      since: {
        default: undefined,
        requiresArg: true,
        type: 'string',
        describe: 'The git ref to diff the current working directory with.'
      },
      file: {
        default: ['**'],
        requiresArg: true,
        type: 'string',
        describe: 'The file(s) to diff'
      }
    }).argv;

  const [cmd, ...args] = argv.args;
  try {
    await runIfDiff(cmd, args, {
      since: argv.since,
      files: [].concat(argv.file)
    });
  } catch (error) {
    if (error instanceof PassThroughError) {
      process.exitCode = error.code;
    } else {
      console.error(error);
      process.exitCode = 1;
    }
  }
})();
