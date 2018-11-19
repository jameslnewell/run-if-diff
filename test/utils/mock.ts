import * as os from 'os';
import * as fs from 'fs-extra';
import {exec} from '../../src/api/utils/shell';

let tmpdir: string | undefined = undefined;

async function createDirectory() {
  const tmpname = await fs.mkdtemp('run-if-diff');
  tmpdir = `${os.tmpdir()}/${tmpname}`;
  await fs.mkdirs(tmpdir);
  console.log(tmpdir);
}

async function createSampleFiles() {
  await fs.writeFile(`${tmpdir}/package.json`, '{"name": "foobar"}');
}

async function git(args: string[]) {
  const {code, stdout, stderr} = await exec('git', args);
  if (code !== 0) {
    throw new Error(
      `Unable to 'git ${args.join(
        ' '
      )}: code=${code} stdout=${stdout} stderr=${stderr}`
    );
  }
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

export async function setupRepositoryWithDiff() {
  console.log('setupRepositoryWithDiff');
  await createDirectory();
  await gitInit();
  await createSampleFiles();
  await gitAdd();
  await gitCommit();
}

export async function setupRepositoryWithoutDiff() {
  console.log('setupRepositoryWithoutDiff');
  await createDirectory();
  await gitInit();
  await createSampleFiles();
  await gitAdd();
}

export async function teardown() {
  if (tmpdir) {
    await fs.rmdir(tmpdir);
    tmpdir = undefined;
  }
}
