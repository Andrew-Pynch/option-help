# package-scripts-help

[![npm version](https://badge.fury.io/js/package-scripts-help.svg)](https://badge.fury.io/js/package-scripts-help)
[![Publish](https://github.com/Andrew-Pynch/option-help/actions/workflows/publish.yml/badge.svg)](https://github.com/Andrew-Pynch/option-help/actions/workflows/publish.yml)

## The problem

Some of the scripts in my package.json files in various projects were growing complex, and large.

## The solution

Created this package to

1. Generate a help.json file from the contents of the scripts of a package.json file.
2. Generate cli help options from the help.json file.

# How to use

Visual Mode

```bash
cd /path/to/package.json
npx package-scripts-help@latest
# use your arrow keys and press enter to select the option you want
```

With Command Line Args

```bash
cd /path/to/package.json
npx package-scripts-help@latest --{flag}
```

## Valid Command Line Flags

Generate help file from package.json scripts.

```bash
--ghf
-ghf
--generate-help-file
-generate-help-file
```

Display help options from help.json file.

```bash
--dho
-dho
--display-help-options
-display-help-options
```

Display help options for this tool.

```bash
--h
-h
--help
-help
```
