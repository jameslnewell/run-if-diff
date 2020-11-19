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

    const { ref, files } = await diff({
      cwd,
      since,
      paths: filePaths,
      statuses: fileStatuses as DiffStatusFilter[],
    });

    console.log(`ref: ${ref}`);
    console.log(`count: ${Object.keys(files).length}`);
    console.log("files:");
    Object.entries(files).forEach(([path, status]) => {
      console.log(` - ${status}\t${path}`);
    });

    core.setOutput("ref", ref);
    core.setOutput("count", Object.keys(files).length);
    core.setOutput("paths", Object.keys(files).join("\n"));
  } catch (error) {
    core.setFailed(error && error.message);
  }
})();
