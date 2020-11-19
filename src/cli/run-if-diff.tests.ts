import {
  cli,
  cleanup,
  createRepositoryWithoutDiff,
  createRepositoryWithDiff,
  CLIResult,
} from "../test-utils";

const runIfDiff = (args: string[]): Promise<CLIResult> =>
  cli("run-if-diff", args);

const cmdExitCode = 111;
const cmdStdOut = "Hello World!";
const cmdStdErr = "";
const cmd = ["--", "bash", "-c", `echo ${cmdStdOut} && exit ${cmdExitCode}`];

const expectCmdToHaveRun = (
  code: number,
  stdout: string,
  stderr: string
): void => {
  expect(code).toEqual(cmdExitCode);
  expect(stdout).toEqual(`${cmdStdOut}\n`);
  expect(stderr).toEqual(cmdStdErr);
};

describe("run-if-diff", () => {
  afterEach(async () => await cleanup());

  test("does not run cmd when files are not different", async () => {
    await createRepositoryWithoutDiff();
    const { code, stdout, stderr } = await runIfDiff([...cmd]);
    expect(code).toEqual(0);
    expect(stdout).toEqual("");
    expect(stderr).toEqual("");
  });

  test("runs cmd when files are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await runIfDiff([...cmd]);
    expectCmdToHaveRun(code, stdout, stderr);
  });

  test("runs cmd when files matching the specified path are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await runIfDiff([
      "--file-path",
      "**/*.js",
      ...cmd,
    ]);
    expectCmdToHaveRun(code, stdout, stderr);
  });

  test("runs cmd when files matching the specified status are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await runIfDiff([
      "--file-status",
      "M",
      ...cmd,
    ]);
    expectCmdToHaveRun(code, stdout, stderr);
  });

  test("runs cmd when files matching the specified status are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await runIfDiff([
      "--file-status",
      "d",
      ...cmd,
    ]);
    expectCmdToHaveRun(code, stdout, stderr);
  });
});
