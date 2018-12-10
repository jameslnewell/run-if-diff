import * as mm from 'micromatch';
import * as git from './git';

export interface DiffOptions {
  since?: string;
  files?: string[];
}

export interface DiffResult {
  ref: string;
  changed: string[];
  matched: string[];
}

export async function diff(options: DiffOptions): Promise<DiffResult> {
  const {since, files = []} = options;
  const ref = since ? since : await git.getDefaultRef();
  const changed = await git.diff(ref);
  const matched = mm(changed, files);
  return {
    ref,
    changed,
    matched
  };
}
