import * as os from 'os';
import * as fs from 'fs-extra';
import * as shell from './api/utils/shell';

let tmpdir: string | undefined = undefined;

export interface CLIResult {
  code: number; 
  stdout: string; 
  stderr: string;
}

export async function cli(command: string, args: string[]): Promise<CLIResult> {
  try {
    return await shell.exec(
      'ts-node',
      ['--project', `${__dirname}/../tsconfig.compile.json`, `${__dirname}/../src/cli/${command}.ts`, '--', ...args],
      {cwd: tmpdir},
    );
  } catch (error) {
    if (error instanceof shell.ExecError) {
      return {code: error.code, stdout: error.stdout, stderr: error.stderr};
    } else {
      throw error;
    }
  }
}

async function git(args: string[]): Promise<void> {
  await shell.exec('git', args, {cwd: tmpdir});
}
async function gitInit(): Promise<void> {
  await git(['init']);
}

async function gitAdd(): Promise<void> {
  await git(['add', '-A']);
}

async function gitCommit(): Promise<void> {
  await git(['commit', '-am', 'sample commit']);
}

async function createDirectory(): Promise<void> {
  tmpdir = await fs.mkdtemp(`${os.tmpdir()}/run-if-diff`);
}

async function createSampleFiles(): Promise<void> {
  await fs.writeFile(`${tmpdir}/package.json`, '{"name": "foobar"}');
  await fs.mkdirs(`${tmpdir}/src`);
  await fs.writeFile(`${tmpdir}/index.js`, 'console.log("Hello World!");');
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
  await fs.writeFile(`${tmpdir}/package.json`, '{"name": "barfoo"}');
  await fs.writeFile(`${tmpdir}/index.js`, 'console.log("hello world!");');
}

export async function cleanup(): Promise<void> {
  if (tmpdir) {
    await fs.emptyDir(tmpdir);
    await fs.remove(tmpdir);
    tmpdir = undefined;
  }
}
