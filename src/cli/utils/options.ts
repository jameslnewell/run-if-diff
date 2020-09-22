import yargs from 'yargs';

export interface Options {
  _: string[];
  file: string | string[];
  since?: string;
}

export const since: yargs.Options = {
  alias: 's',
  default: undefined,
  requiresArg: true,
  type: 'string',
  describe: 'The git ref to diff the current working directory with.',
};

export const file: yargs.Options = {
  alias: 'f',
  default: ['**'],
  requiresArg: true,
  type: 'string',
  describe: 'The file(s) to diff',
};
