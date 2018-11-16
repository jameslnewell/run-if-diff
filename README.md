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
run-if-diff --since master --file *.yml long-running-command
```
