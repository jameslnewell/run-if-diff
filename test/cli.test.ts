import {exec} from './utils/exec';
import {
  teardown,
  setupRepositoryWithoutDiff,
  setupRepositoryWithDiff
} from './utils/mock';

describe('cli', () => {
  afterEach(async () => await teardown());

  it('should exit successfully when the files have not changed', async () => {
    await setupRepositoryWithoutDiff();
    const {code, stdout, stderr} = await exec(['ls']);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('package.json');
  });

  it('should exit successfully when the files have changed and the command exits successfully', async () => {
    await setupRepositoryWithDiff();
    const {code, stdout, stderr} = await exec(['ls']);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('package.json');
  });

  it('should exit with an error when the files have changed and the command exits with an error', async () => {
    await setupRepositoryWithDiff();
    const {code, stdout, stderr} = await exec(['ls', 'non-existent-directory']);
    expect(code).toEqual(1);
    expect(stdout).toEqual('');
    expect(stderr).toMatch('No such file or directory');
  });
});
