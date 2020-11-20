import * as log from "./utils/debug";
import * as git from "./utils/git";

export type DiffStatus = git.DiffStatus;
export const DiffStatus = git.DiffStatus;

export interface DiffOptions {
  cwd?: string;
  since?: git.DiffOptions["ref"];
  paths?: git.DiffOptions["paths"];
  statuses?: git.DiffOptions["statuses"];
}

export interface DiffResult {
  ref: string;
  count: number;
  paths: string[];
  statuses: Record<string, git.DiffStatus>;
}

export async function diff(options: DiffOptions = {}): Promise<DiffResult> {
  const { cwd, since, paths, statuses } = options;

  const ref = since ? since : await git.getDefaultRef({ cwd });
  const statusesByFile = await git.diff({
    cwd,
    ref,
    paths,
    statuses,
  });

  const result = {
    ref,
    count: Object.keys(statusesByFile).length,
    paths: Object.keys(statusesByFile),
    statuses: statusesByFile
  };
  log.diff(result);
  return result;
}
