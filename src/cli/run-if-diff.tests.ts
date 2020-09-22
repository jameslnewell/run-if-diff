import {
  cli,
  cleanup,
  createRepositoryWithoutDiff,
  createRepositoryWithDiff,
  CLIResult,
} from "../test-utils";

const runIfDiff = (args: string[]): Promise<CLIResult> =>
  cli("run-if-diff", args);

describe.skip("run-if-diff", () => {
  afterEach(async () => await cleanup());

  test("should exit successfully before running the command when the files have not changed", async () => {
    await createRepositoryWithoutDiff();
    const { code, stdout, stderr } = await runIfDiff(["--", "ls", "-la"]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("");
  });

  test("should exit successfully after running the command when the files have changed and the command exits successfully", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await runIfDiff(["--", "ls"]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("package.json");
  });

  test("should exit with an error after running the command when the files have changed and the command exits with an error", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await runIfDiff([
      "--",
      "ls",
      "non-existent-directory",
    ]);
    expect(code).toEqual(1);
    expect(stdout).toEqual("");
    expect(stderr).toMatch("No such file or directory");
  });

  test("should exit successfully after running the command when the files have changed and the command exits successfully", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await runIfDiff(["--", "ls"]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("package.json");
  });

  // TODO: test --since
  // TODO: test --file
});
