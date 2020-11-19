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

  test("exits with 0 when files are not different", async () => {
    await createRepositoryWithoutDiff();
    const { code, stdout, stderr } = await exitIfDiff([]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toEqual("");
  });

  test("exits with 128 when files are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await exitIfDiff([]);
    expect(code).toEqual(128);
    expect(stderr).toEqual("");
    expect(stdout).toEqual("");
  });

  test("exits with 128 when files matching the specified path are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await exitIfDiff(["--file-path", "**/*.js"]);
    expect(code).toEqual(128);
    expect(stderr).toEqual("");
    expect(stdout).toEqual("");
  });

  test("exits with 128 when files matching the specified status are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await exitIfDiff([
      "--file-status",
      "M"
    ]);
    expect(code).toEqual(128);
    expect(stderr).toEqual("");
    expect(stdout).toEqual("");
  });

  test("exits with 128 when files not matching the specified status are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await exitIfDiff([
      "--file-status",
      "d"
    ]);
    expect(code).toEqual(128);
    expect(stderr).toEqual("");
    expect(stdout).toEqual("");
  });
  
});
