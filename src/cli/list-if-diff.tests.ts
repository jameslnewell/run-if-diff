import {
  cli,
  CLIResult,
  cleanup,
  createRepositoryWithoutDiff,
  createRepositoryWithDiff,
} from "../test-utils";

const listIfDiff = (args: string[]): Promise<CLIResult> =>
  cli("list-if-diff", args);

describe("list-if-diff", () => {
  afterEach(async () => await cleanup());

  test("does not list files when no files are not different", async () => {
    await createRepositoryWithoutDiff();
    const { code, stdout, stderr } = await listIfDiff([]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toEqual("");
  });

  test("lists files when files are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await listIfDiff([]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("README.md");
    expect(stdout).toMatch("src/index.js");
    expect(stdout).toMatch("src/index.test.js");
    expect(stdout).toMatch("package.json");
  });

  test("lists files when files matching the specified path are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await listIfDiff(["--file-path", "**/*.js"]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).not.toMatch("README.md");
    expect(stdout).toMatch("src/index.js");
    expect(stdout).toMatch("src/index.test.js");
    expect(stdout).not.toMatch("package.json");
  });

  test("lists files when files matching the specified status are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await listIfDiff([
      "--file-status",
      "M"
    ]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).not.toMatch("README.md");
    expect(stdout).toMatch("package.json");
    expect(stdout).toMatch("src/index.js");
    expect(stdout).not.toMatch("src/index.test.js");
  });

  test("lists files when files not matching the specified status are different", async () => {
    await createRepositoryWithDiff();
    const { code, stdout, stderr } = await listIfDiff([
      "--file-status",
      "d"
    ]);
    expect(code).toEqual(0);
    expect(stderr).toEqual("");
    expect(stdout).toMatch("README.md");
    expect(stdout).toMatch("package.json");
    expect(stdout).toMatch("src/index.js");
    expect(stdout).not.toMatch("src/index.test.js");
  });

});
