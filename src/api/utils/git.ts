import * as debug from "./debug";
import * as shell from "./shell";

async function hasOneOrMoreTags({ cwd }: { cwd?: string }): Promise<boolean> {
  const { stdout } = await shell.exec("git", ["tag"], { cwd });
  return stdout.trim() !== "";
}

async function getMostRecentTag({ cwd }: { cwd?: string }): Promise<string> {
  const { stdout } = await shell.exec(
    "git",
    ["describe", "--tags", "--abbrev=0"],
    { cwd }
  );
  return stdout.split("\n")[0];
}

async function getFirstCommit({ cwd }: { cwd?: string }): Promise<string> {
  const { stdout } = await shell.exec(
    "git",
    ["rev-list", "--max-parents=0", "HEAD"],
    { cwd }
  );
  return stdout.split("\n")[0];
}

export async function getDefaultRef({
  cwd,
}: {
  cwd?: string;
}): Promise<string> {
  const hasTags = await hasOneOrMoreTags({ cwd });
  if (hasTags) {
    debug.log("the repo has tags, defaulting to the most recent tag");
    return await getMostRecentTag({ cwd });
  } else {
    debug.log("the repo has no tags, defaulting to the first commit");
    return await getFirstCommit({ cwd });
  }
}

// @see https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---diff-filterACDMRTUXB82308203
export enum DiffStatus {
  Added = "A",
  Copied = "C",
  Deleted = "D",
  Modified = "M",
  Renamed = "R",
  ChangedType = "T",
  Unmerged = "U",
  Unknown = "X",
  Broken = "B",
}

export type DiffPathFilter = string;
export type DiffStatusFilter =
  | "A"
  | "C"
  | "D"
  | "M"
  | "R"
  | "T"
  | "U"
  | "X"
  | "B"
  | "a"
  | "c"
  | "d"
  | "m"
  | "r"
  | "t"
  | "u"
  | "x"
  | "b";

export interface DiffOptions {
  cwd?: string;
  ref?: string;
  paths?: Array<DiffPathFilter>;
  statuses?: Array<DiffStatusFilter>;
}

const isStatus = (status: string): status is DiffStatusFilter =>
  Object.values(DiffStatus).includes(status as any) ||
  Object.values(DiffStatus)
    .map((s) => s.toLowerCase())
    .includes(status as any);

export async function diff(
  options?: DiffOptions
): Promise<Record<string, DiffStatus>> {
  const cmd = "git";
  const args = ["diff", "--name-status"];
  if (options?.ref) {
    args.push(options.ref);
  }
  if (options?.statuses?.length) {
    args.push("--diff-filter", options.statuses.join(""));
  }
  if (options?.paths?.length) {
    args.push(...options.paths);
  }
  const { stdout } = await shell.exec(cmd, args, { cwd: options?.cwd });
  const statusesByFile: Record<string, DiffStatus> = {};
  stdout
    .split("\n")
    .filter((line) => line !== "")
    .forEach((line) => {
      const [status, file] = line.split(/\s+/);
      if (isStatus(status) && file) {
        statusesByFile[file] = status as DiffStatus;
      }
    });
  return statusesByFile;
}
