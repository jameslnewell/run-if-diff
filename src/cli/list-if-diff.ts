#!/usr/bin/env node
/* tslint:disable: no-console */

import fs from "fs";
import debug from "debug";
import yargs from "yargs";
import { diff } from "../api";
import { Options, since, file, ignoreDeleted } from "./utils/options";

const log = debug("list-if-diff");

(async () => {
  const argv = (yargs
    .strict()
    .help()
    .usage("$0", "list files which have changed", {
      since,
      file,
      ignoreDeleted,
    }).argv as unknown) as Options;

  try {
    const result = await diff({
      since: argv.since,
      files: Array.isArray(argv.file) ? argv.file : [argv.file],
    });
    result.matched
      .filter((file) => {
        if (argv.ignoreDeleted) {
          return fs.existsSync(file);
        } else {
          return true;
        }
      })
      .forEach((file) => console.log(file));
    log(`exit code: 0`);
    process.exitCode = 0;
  } catch (error) {
    log(`exit code: 1`);
    console.error(error);
    process.exitCode = 1;
  }
})();
