import {
  cli,
  cleanup,
  createRepositoryWithoutDiff,
  createRepositoryWithDiff
} from './utils';

describe('cli', () => {
  afterEach(async () => await cleanup());

  it('should exit successfully before running the command when the files have not changed', async () => {
    await createRepositoryWithoutDiff();
    const {code, stdout, stderr} = await cli(['--', 'ls', '-la']);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('');
  });

  it('should exit successfully after running the command when the files have changed and the command exits successfully', async () => {
    await createRepositoryWithDiff();
    const {code, stdout, stderr} = await cli(['--', 'ls']);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('package.json');
  });

  it('should exit with an error after running the command when the files have changed and the command exits with an error', async () => {
    await createRepositoryWithDiff();
    const {code, stdout, stderr} = await cli([
      '--',
      'ls',
      'non-existent-directory'
    ]);
    expect(code).toEqual(1);
    expect(stdout).toEqual('');
    expect(stderr).toMatch('No such file or directory');
  });

  it('should exit successfully after running the command when the files have changed and the command exits successfully', async () => {
    await createRepositoryWithDiff();
    const {code, stdout, stderr} = await cli(['--', 'ls']);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('package.json');
  });

  // TODO: test --since
  // TODO: test --file
});
