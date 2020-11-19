import yargs from "yargs";
import { DiffOptions, DiffStatus } from "../../api";

export interface CLIOptions {
  _: string[];
  since?: string;
  "file-path": string | string[];
  "file-status": string | string[];
}

const since: yargs.Options = {
  default: undefined,
  requiresArg: true,
  type: "string",
  describe: "The git ref the diff will be run against.",
};

const filePath: yargs.Options = {
  default: [],
  requiresArg: true,
  type: "string",
  describe: "The path(s) to filter by.",
};

const fileStatus: yargs.Options = {
  default: [],
  requiresArg: true,
  type: "string",
  describe: "The status(es) to filter by.",
  choices: [
    ...Object.values(DiffStatus).map((s) => s.toUpperCase()),
    ...Object.values(DiffStatus).map((s) => s.toLowerCase()),
  ],
};

export const options = {
  since,
  "file-path": filePath,
  "file-status": fileStatus,
};

export const getAPIOptionsFromCLIOptions = (
  options: CLIOptions
): DiffOptions => {
  return {
    since: options.since,
    paths: Array.isArray(options["file-path"])
      ? options["file-path"]
      : options["file-path"]
      ? [options["file-path"]]
      : undefined,
    statuses: Array.isArray(options["file-status"])
      ? ((options["file-status"] as unknown) as DiffStatus[])
      : options["file-status"]
      ? ([options["file-status"]] as DiffStatus[])
      : undefined,
  };
};
