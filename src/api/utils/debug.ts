import debug from "debug";
import { DiffResult } from "..";

export const log = debug("run-if-diff");

export function diff({ ref, count, paths, statuses }: DiffResult): void {
  log(`ref: ${ref}`);
  log(`count: ${count}`);
  log(`paths: \n${paths.join("\n")}`);
  log(
    `statuses: \n\t ${Object.keys(statuses)
      .sort()
      .map((path) => `${statuses[path]} ${path}`)
      .join("\n\t ")}\n`
  );
}
