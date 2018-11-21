# run-if-diff

[![satay](https://img.shields.io/npm/v/run-if-diff.svg)](https://www.npmjs.com/package/run-if-diff)
[![Travis](https://img.shields.io/travis/jameslnewell/run-if-diff.svg)](https://travis-ci.org/jameslnewell/run-if-diff)

Run a command if files are different.

## Installation

```
yarn add run-if-diff
```

## Usage

```
run-if-diff [--since <ref>] [--file <glob>] -- <cmd>
```

Example:

```
run-if-diff --since v1.3.1 --file my-app.yml -- aws cfn deploy --stack-name my-app --template-file my-app.yml
```

## CLI

### Options

#### `--since`

The git ref to compare files in the current working directory to. Defaults to the most recent tag or the initial commit.

#### `--file`

A file or a glob that must be different for the command to be run.

If you specify multiple `--file` options, the command will run if _any_ of the `--file` options are matched.

## Credits

Inspired by `lerna`'s `--since` filter.

## License

Copyright 2018 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
