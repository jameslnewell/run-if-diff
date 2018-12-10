import * as os from 'os';
import * as fs from 'fs-extra';
import * as shell from '../../src/api/utils/shell';

let tmpdir: string | undefined = undefined;

export async function cli(args: string[]) {
  try {
    return await shell.exec(
      'ts-node',
      [`${__dirname}/../../src/cli/run-if-diff.ts`, '--', ...args],
      {cwd: tmpdir}
    );
  } catch (error) {
    if (error instanceof shell.ExecError) {
      return {code: error.code, stdout: error.stdout, stderr: error.stderr};
    } else {
      throw error;
    }
  }
}

async function git(args: string[]) {
  await shell.exec('git', args, {cwd: tmpdir});
}
async function gitInit() {
  await git(['init']);
}

async function gitAdd() {
  await git(['add', '-A']);
}

async function gitCommit() {
  await git(['commit', '-am', 'sample commit']);
}

async function createDirectory() {
  tmpdir = await fs.mkdtemp(`${os.tmpdir()}/run-if-diff`);
}

async function createSampleFiles() {
  await fs.writeFile(`${tmpdir}/package.json`, '{"name": "foobar"}');
  await fs.mkdirs(`${tmpdir}/src`);
  await fs.writeFile(`${tmpdir}/index.js`, 'console.log("Hello World!");');
}

export async function createRepositoryWithoutDiff() {
  await createDirectory();
  await gitInit();
  await createSampleFiles();
  await gitAdd();
  await gitCommit();
}

export async function createRepositoryWithDiff() {
  await createDirectory();
  await gitInit();
  await createSampleFiles();
  await gitAdd();
  await gitCommit();
  await fs.writeFile(`${tmpdir}/package.json`, '{"name": "barfoo"}');
}

export async function cleanup() {
  if (tmpdir) {
    await fs.emptyDir(tmpdir);
    await fs.remove(tmpdir);
    tmpdir = undefined;
  }
}
