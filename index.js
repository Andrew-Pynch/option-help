#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import fs from 'fs';
import inquirer from 'inquirer';

const PROGRAM_EXECUTING = true;

const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const CLI_OPTIONS = {
    'generate-help-file': [
        '--ghf',
        '-ghf',
        '--generate-help-file',
        '-generate-help-file',
    ],
    'display-help-options': [
        '--dho',
        '-dho',
        '--display-help-options',
        '-display-help-options',
    ],
    'display-cli-help': ['--h', '-h', '--help', '-help'],
};

async function startup() {
    try {
        const rainbowTitle = chalkAnimation.rainbow('option-help \n');
        await sleep();
        rainbowTitle.stop();

        console.log(`
    ${chalk.bold.cyan('HOW TO USE')}
    Make sure you have created a help.json file in the same directory as your package.json file.

    option-help docs: ${chalk.italic.blue(
        ' https://github.com/Andrew-Pynch/option-help'
    )}
          `);
        main();
    } catch (e) {
        console.error(e);
    }
}

function main(firstAttempt = true) {
    let cliArg = '';
    if (firstAttempt !== false) {
        cliArg = getCliArg();
    } else {
        cliArg = 'no-command';
    }
    const command = parseCliArgs(cliArg, CLI_OPTIONS);
    executeCommand(command);
}

async function executeCommand(command) {
    try {
        switch (command) {
            case 'generate-help-file':
                console.log('generate-help-file');
                generateHelpFromScripts(getPackageJsonScripts()['scripts']);
                break;

            case 'display-help-options':
                console.log('display-help-options');
                displayHelpOptions();
                break;

            case 'display-cli-help':
                console.log('displaying cli help');
                displayCliHelp(CLI_OPTIONS);
                break;

            case 'no-command':
                getOptionSelection(CLI_OPTIONS);
                break;

            case 'exit':
                console.log(chalk.green('exiting option-help \n'));
                process.exit(1);

            default:
                getOptionSelection(CLI_OPTIONS);
                break;
        }
    } catch (e) {}
}

function displayHelpOptions() {
    try {
        const helpOptions = getHelpOptionsFromFile();
        for (const [command, details] of Object.entries(helpOptions)) {
            console.log(`
    ${chalk.italic.green(`EX: yarn `)} ${command}
    ${chalk.bold.cyan(`command name: `)} ${command}
    ${chalk.italic.yellow(`description: `)} ${details.description}
    ${chalk.italic.cyan(`supporting documentation link: `)} ${
                details.supportingDocumentationLink
            }
            `);
        }
    } catch (e) {
        // console.log('ERROR IS HAPPENING HERE');
        // console.error(e);
    }
}

function getOptionSelection(cliOptions) {
    let command = '';
    const cliOptionsKeys = Object.keys(cliOptions);

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What command would you like to run',
                choices: [...cliOptionsKeys, 'exit'],
            },
        ])
        .then((answers) => {
            executeCommand(answers.command);
        });
}

function displayCliHelp(cliOptions) {
    console.log(`
    ${chalk.bold.cyan('cliOptions for option-help')}


    ${chalk.bold.cyan('CLI OPTIONS')}
    ${chalk.bold.yellow('--ghf')}
    ${chalk.bold.yellow('-ghf')}
    ${chalk.bold.yellow('--generate-help-file')}
    ${chalk.bold.yellow('-generate-help-file')}
    Generate help file from package.json scripts.

    ${chalk.bold.yellow('--dho')}
    ${chalk.bold.yellow('-dho')}
    ${chalk.bold.yellow('--display-help-options')}
    ${chalk.bold.yellow('-display-help-options')}
    Display help options from help.json file.

    ${chalk.bold.yellow('--h')}
    ${chalk.bold.yellow('-h')}
    ${chalk.bold.yellow('--help')}
    ${chalk.bold.yellow('-help')}
    Display help options.
    `);
}

function countCharOccurences(str, find) {
    return str.split(find).length - 1;
}

function getCliArg() {
    try {
        const allArgs = process.argv.slice(2);
        const firstArg = allArgs[0];
        return firstArg;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

function parseCliArgs(cliArg, cliOptions) {
    for (const command in cliOptions) {
        const validCommandOptions = cliOptions[command];
        const validOptionItems = [
            validCommandOptions[0],
            validCommandOptions[1],
            validCommandOptions[2],
            validCommandOptions[3],
        ];

        for (const validOption in validOptionItems) {
            if (validOptionItems[validOption] === cliArg) return command;
        }
    }
}

function generateHelpFromScripts(scripts) {
    const helpOptions = {};
    Object.keys(scripts).forEach((key) => {
        console.log(key, scripts[key]);
        const scriptName = key;
        const scriptComamand = scripts[key];
        helpOptions[scriptName] = {
            command: scriptComamand,
            description: '',
            supportingDocumentationLink: '',
        };
    });
    writeHelpOptionsToFile(helpOptions);
}

function writeHelpOptionsToFile(helpOptions) {
    try {
        const data = JSON.stringify(helpOptions);
        fs.writeFileSync('help.json', data);
        console.log(chalk.green('Wrote help.json file in current directory.'));
        main(false);
    } catch (err) {
        console.error(chalk.bold.red(err));
    }
}

function getPackageJsonScripts() {
    try {
        const data = fs.readFileSync('package.json', 'utf8');
        const packageJson = JSON.parse(data);
        return packageJson;
    } catch (e) {
        console.error(e);
    }
}

function getHelpOptionsFromFile() {
    try {
        const data = fs.readFileSync('help.json', 'utf8');
        const helpOptions = JSON.parse(data);
        if (helpOptions.length > 0) {
            throw new Error("couldn't find file");
        }
        return helpOptions;
    } catch (e) {
        if (
            e
                .toString()
                .includes("no such file or directory, open 'help.json'") ||
            e.toString().includes("couldn't find file")
        ) {
            console.log(`
    ${chalk.bold.red('No help.json file found in current directory.')}
    ${chalk.yellow(`
    You can generate one by running npx option-help --ghf or selecting
    generate-help-file after running npx option-help with no cli flags.
    `)}
    `);
        }

        main(false);
    }
}

startup();
