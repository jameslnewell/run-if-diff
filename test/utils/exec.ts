import * as shell from '../../src/api/utils/shell';

export async function exec(args: string[]) {
  return await shell.exec('ts-node', [
    `${__dirname}/../../src/cli/index.ts`,
    ...args
  ]);
}
