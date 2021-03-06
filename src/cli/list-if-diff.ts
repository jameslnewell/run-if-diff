#!/usr/bin/env node
/* tslint:disable: no-console */

import yargs from "yargs";
import { diff } from "../api";
import {
  CLIOptions,
  options,
  getAPIOptionsFromCLIOptions,
} from "./utils/options";
import * as debug from "./utils/debug";

(async () => {
  const argv = (yargs
    .strict()
    .help()
    .usage("$0", "list files which have changed", options)
    .argv as unknown) as CLIOptions;

  try {
    const { paths } = await diff(getAPIOptionsFromCLIOptions(argv));
    paths.forEach((path) => console.log(path));
    debug.log(`exiting with 0`);
    process.exitCode = 0;
  } catch (error) {
    debug.log(`exiting with 1`);
    console.error(error);
    process.exitCode = 1;
  }
})();
