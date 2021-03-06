import * as os from "os";
import * as fs from "fs-extra";
import * as shell from "./api/utils/shell";

let tmpdir: string | undefined = undefined;

export interface CLIResult {
  code: number;
  stdout: string;
  stderr: string;
}

export async function cli(command: string, args: string[]): Promise<CLIResult> {
  try {
    return await shell.exec(
      "node",
      [`${__dirname}/../lib/cli/${command}.js`, ...args],
      { cwd: tmpdir }
    );
  } catch (error) {
    if (error instanceof shell.ExecError) {
      return { code: error.code, stdout: error.stdout, stderr: error.stderr };
    } else {
      throw error;
    }
  }
}

export function getDirectory(): string {
  if (!tmpdir) {
    throw new Error("Call createDirectory() before calling getDirectory()");
  }
  return tmpdir;
}

async function git(args: string[]): Promise<void> {
  await shell.exec("git", args, { cwd: tmpdir });
}
async function gitInit(): Promise<void> {
  await git(["init"]);
}

async function gitAdd(): Promise<void> {
  await git(["add", "-A"]);
}

async function gitCommit(): Promise<void> {
  await git(["commit", "-am", "sample commit"]);
}

async function gitTag(): Promise<void> {
  await git(["tag", "foobar"]);
}

async function createDirectory(): Promise<void> {
  tmpdir = await fs.mkdtemp(`${os.tmpdir()}/run-if-diff`);
}

async function createSampleFiles(): Promise<void> {
  await fs.writeFile(`${tmpdir}/package.json`, '{"name": "foobar"}');
  await fs.mkdirs(`${tmpdir}/src`);
  await fs.writeFile(`${tmpdir}/src/index.js`, 'console.log("Hello World!");');
  await fs.writeFile(
    `${tmpdir}/src/index.test.js`,
    'test("logs message", () => {})'
  );
}

async function updateSampleFiles(): Promise<void> {
  await fs.writeFile(`${tmpdir}/README.md`, "# Sample");
  await fs.writeFile(`${tmpdir}/package.json`, '{"name": "barfoo"}');
  await fs.writeFile(`${tmpdir}/src/index.js`, 'console.log("hello world!");');
  await fs.unlink(`${tmpdir}/src/index.test.js`);
}

export async function createRepositoryWithoutDiff(): Promise<void> {
  await createDirectory();
  await gitInit();
  await createSampleFiles();
  await gitAdd();
  await gitCommit();
}

export async function createRepositoryWithDiff(): Promise<void> {
  await createDirectory();
  await gitInit();
  await createSampleFiles();
  await gitAdd();
  await gitCommit();
  await gitTag();
  await updateSampleFiles();
  await gitAdd();
  await gitCommit();
}

export async function cleanup(): Promise<void> {
  if (tmpdir) {
    await fs.emptyDir(tmpdir);
    await fs.remove(tmpdir);
    tmpdir = undefined;
  }
}
