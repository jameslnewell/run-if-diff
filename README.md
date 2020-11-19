# run-if-diff

[![run-if-diff](https://img.shields.io/npm/v/run-if-diff.svg)](https://www.npmjs.com/package/run-if-diff)
![run-if-diff](https://github.com/jameslnewell/run-if-diff/workflows/Package/badge.svg)

Run a command if files are different.

## Installation

```bash
# npm
npm i -S run-if-diff

# yarn
yarn add --dev run-if-diff
```

## Usage

### `exit-if-diff`

Exit with an exit code of `128` if matching files have changed, Exit with an exit code of `0` if no matching files have changed.

```bash
exit-if-diff [--since <ref>] [--file-path <glob>] [--file-status
<status>] [--exit-code-when-changed 128] [--exit-code-when-unchanged 0]
```

Example:

```bash
set +e
exit-if-diff --since v1.3.1 --file-path my-app.yml
set -e
if [ $? -eq 128 ]
  aws cfn deploy --stack-name my-app --template-file my-app.yml
fi
```

### `list-if-diff`

List matching files that have changed.

```bash
list-if-diff [--since <ref>] [--file-path <glob>] [--file-status <status>]
```

Example:

```bash
list-if-diff --since v1.3.1 --file-path my-app.yml | xargs eslint
```

### `run-if-diff`

Run a command and passthru it's output if matching files have changed.

```bash
run-if-diff [--since <ref>] [--file-path <glob>] [--file-status <status>] -- <cmd>
```

Example:

```bash
run-if-diff --since v1.3.1 --file-path my-app.yml -- aws cfn deploy --stack-name my-app --template-file my-app.yml
```

### Common Options

#### `--since`

A git ref to compare the current working directory to. Defaults to the most recent tag or the initial commit.

#### `--file-path`

A file path (or glob) to filter the files by.

If you specify multiple `--file-path` options, files matching _any_ of the options are returned.

#### `--file-status`

A file status to filter the files by.

Use uppercase letters to include the status from the results. e.g. `A`, `B`, `D`, `M`, `R`, `T`, `U`, `X`

Use lowercase letters to include the status from the results. e.g. `a`, `b`, `d`, `m`, `r`, `t`, `u`, `x`

If you specify multiple `--file-status` options, files matching _any_ of the options are returned.

### action

```yml
steps:
  - uses: actions/checkout@v2
  - uses: jameslnewell/run-if-diff@master
    with:
      file-path: |
        apps/**/*.tsx
        packages/**/*.tsx
      file-status: |
        d
```

#### cwd

#### since

#### file-path

#### file-status

## Credits

Inspired by `lerna`'s `--since` filter.

## License

Copyright 2018 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
