import {
  cli,
  CLIResult,
  cleanup,
  createRepositoryWithoutDiff,
  createRepositoryWithDiff,
} from '../test-utils';

const listIfDiff = (args: string[]): Promise<CLIResult> => cli('list-if-diff', args);

describe('list-if-diff', () => {
  afterEach(async () => await cleanup());

  test('no files are listed when no files have changed', async () => {
    await createRepositoryWithoutDiff();
    const {code, stdout, stderr} = await listIfDiff([]);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('');
  });

  test('files are listed when files have changed', async () => {
    await createRepositoryWithDiff();
    const {code, stdout, stderr} = await listIfDiff([]);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('index.js');
    expect(stdout).toMatch('package.json');
  });

  test('no files are listed when no files matching the glob have changed', async () => {
    await createRepositoryWithoutDiff();
    const {code, stdout, stderr} = await listIfDiff(['--file', '*.js']);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('');
  });

  test('files are listed when files matching the glob have changed', async () => {
    await createRepositoryWithDiff();
    const {code, stdout, stderr} = await listIfDiff(['--file', '*.js']);
    expect(code).toEqual(0);
    expect(stderr).toEqual('');
    expect(stdout).toMatch('index.js');
  });
  
  
});
