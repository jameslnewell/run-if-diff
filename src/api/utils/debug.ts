import debug from "debug";
import { DiffStatus, DiffResult } from "..";

export const log = debug("run-if-diff");

function formatFileListForLog(
  statusByFile: Record<string, DiffStatus>
): string {
  const entries = Object.entries(statusByFile);
  if (entries.length === 0) {
    return "";
  }
  return `\n\t ${Object.keys(statusByFile)
    .sort()
    .map((file) => `${statusByFile[file]}\t${file}`)
    .join("\n\t ")}`;
}

export function diff({ ref, files }: DiffResult): void {
  log(`ref: ${ref}`);
  log(
    `files: ${Object.entries(files).length} files${formatFileListForLog(
      files
    )}\n`
  );
}
