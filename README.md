# run-if-diff

[![satay](https://img.shields.io/npm/v/run-if-diff.svg)](https://www.npmjs.com/package/run-if-diff)
[![Travis](https://img.shields.io/travis/jameslnewell/run-if-diff.svg)](https://travis-ci.org/jameslnewell/run-if-diff)

Runs a command if files are different.

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

## Options

### `--since`

The git ref to compare files in the current working directory to. Defaults to the most recent tag or the initial commit.

### `--file`

A file or a glob that must be different for the command to be run.

If you specify multiple `--file` options, the command will run if _any_ of the `--file` options are matched.
