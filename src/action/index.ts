import * as core from "@actions/core";
import { DiffStatusFilter } from "../api/utils/git";
import { diff } from "../api";

(async () => {
  try {
    const cwd = core.getInput("cwd");
    const since = core.getInput("since");
    const filePaths = core
      .getInput("file-path")
      .split("\n")
      .filter((p) => !!p);
    const fileStatuses = core
      .getInput("file-status")
      .split("\n")
      .filter((p) => !!p);

    const { ref, count, paths, statuses } = await diff({
      cwd,
      since,
      paths: filePaths,
      statuses: fileStatuses as DiffStatusFilter[],
    });

    console.log(`ref: ${ref}`);
    console.log(`count: ${count}`);
    console.log("files:");
    Object.entries(statuses).forEach(([path, status]) => {
      console.log(` - ${status} ${path}`);
    });

    core.setOutput("ref", ref);
    core.setOutput("count", count);
    core.setOutput("paths", paths.join("\n"));
  } catch (error) {
    core.setFailed(error && error.message);
  }
})();
