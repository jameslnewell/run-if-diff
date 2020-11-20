#!/usr/bin/env node
/* tslint:disable: no-console no-var-requires */

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
    .usage("$0", "exit if files have changed", {
      ...options,
      "exit-code-when-changed": {
        default: 128,
        requiresArg: true,
        type: "number",
        describe: "The exit code when matching files have changed.",
      },
      "exit-code-when-unchanged": {
        default: 0,
        requiresArg: true,
        type: "number",
        describe: "The exit code when no matching files have changed.",
      },
    }).argv as unknown) as CLIOptions & {
    "exit-code-when-changed": number;
    "exit-code-when-unchanged": number;
  };

  try {
    const { count } = await diff(getAPIOptionsFromCLIOptions(argv));
    if (count > 0) {
      debug.log(`exiting with 128`);
      process.exitCode = argv["exit-code-when-changed"];
    } else {
      debug.log(`exiting with 0`);
      process.exitCode = argv["exit-code-when-unchanged"];
    }
  } catch (error) {
    debug.log(`exiting with 1`);
    console.error(error);
    process.exitCode = 1;
  }
})();
