#!/usr/bin/env node
/* tslint:disable: no-console no-var-requires */

import * as yargs from 'yargs';
import runIfDiff from '../api';

(() => {

  const argv = yargs
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
        type: 'array',
        describe: 'The file(s) to diff'
      },
    })
    .argv
  ;

  const [cmd, ...args] = argv.args;
  runIfDiff(cmd, args, {
    since: argv.since,
    patterns: argv.file
  });

})();
