import {
  cli,
  CLIResult,
  cleanup,
  createRepositoryWithoutDiff,
  createRepositoryWithDiff,
} from "../test-utils";

const exitIfDiff = (args: string[]): Promise<CLIResult> =>
  cli("exit-if-diff", args);

describe("exit-if-diff", () => {
  afterEach(async () => await cleanup());

  test("exit code is 0 when files have not changed", async () => {
    await createRepositoryWithoutDiff();
    const { code, stdout, stderr } = await exitIfDiff([]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("");
  });

  test("exit code is 128 when files have changed", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await exitIfDiff([]);
    expect(code).toEqual(128);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("");
  });

  test("exit code is 0 when files matching the glob have not changed", async () => {
    await createRepositoryWithoutDiff();
    const { code, stdout, stderr } = await exitIfDiff(["--file", "*.js"]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("");
  });

  test("exit code is 128 when files matching the glob have changed", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await exitIfDiff(["--file", "*.js"]);
    expect(code).toEqual(128);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("");
  });
});
