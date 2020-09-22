import debug from "debug";
import { DiffResult } from "../../api";

function formatFileListForLog(files: string[]): string {
  if (files.length === 0) {
    return "";
  }
  return `\n\t- ${files.join("\n\t- ")}`;
}

export function diffResult(logger: debug.IDebugger, result: DiffResult): void {
  logger(`ref: ${result.ref}`);
  logger(
    `changed: ${result.changed.length} files${formatFileListForLog(
      result.changed.sort()
    )}\n`
  );
  logger(
    `matched: ${result.matched.length} files${formatFileListForLog(
      result.matched.sort()
    )}\n`
  );
}
