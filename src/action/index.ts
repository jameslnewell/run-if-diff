import * as core from "@actions/core";
import { DiffStatusFilter } from "../api/utils/git";
import { diff } from "../api";

(async () => {
  try {
    const cwd = core.getInput("cwd");
    const since = core.getInput("since");
    console.log(JSON.stringify(core
      .getInput("file-path")), JSON.stringify(core
        .getInput("file-path")
        .split("\n")
        .filter((p) => !!p)))
      console.log(JSON.stringify(core
        .getInput("file-status")), JSON.stringify(core
          .getInput("file-status")
          .split("\n")
          .filter((p) => !!p)))
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

    core.setOutput("ref", ref);
    core.setOutput("files", files);
  } catch (error) {
    core.setFailed(error && error.message);
  }
})();
