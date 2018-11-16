// tslint:disable no-console
import * as mm from 'micromatch';
import {diff} from './utils/git';
import {passthru} from './utils/shell';

export interface Options {
  since?: string;
  patterns?: string[];
}

export default async function(cmd: string, args: string[], options: Options) {
  try {
    const {
      since, 
      patterns
    } = options;

    const files = await diff(since);
    const matches = mm(files, patterns);
    if (matches.length) {
      const {code} = await passthru(cmd, args);
      process.exitCode = code;
    }

  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};
