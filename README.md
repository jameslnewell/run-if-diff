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
run-if-diff [--since <ref>] [--file <glob>] <cmd>
```

```
run-if-diff --since master --file '*.yml' long-running-command
```

## Options

### since

The git ref to compare the files in the current working directory to. Defaults to the last tag or commit.

### file

A file name or a glob that determines whether the command is run

If you specify multiple file options, the command will be run if **any** of the files are matched.
