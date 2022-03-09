#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import fs from 'fs';
import inquirer from 'inquirer';

const PROGRAM_EXECUTING = true;

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

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
        const rainbowTitle = chalkAnimation.rainbow('option help \n');
        await sleep();
        rainbowTitle.stop();

        console.log(`
    ${chalk.bold.cyan('HOW TO USE')}
    Make sure you have created a help.json file in the same directory as your package.json file.

    ${chalk.italic.blue('https://youtube.com')}
          `);
        main();
    } catch (e) {
        console.error(e);
    }
}

function main() {
    const cliArg = getCliArg();
    const command = parseCliArgs(cliArg, CLI_OPTIONS);
    executeCommand(command);
}

function executeCommand(command) {
    try {
        switch (command) {
            case 'generate-help-file':
                // generateHelpFromScripts();
                console.log('generate-help-file');
                break;

            case 'display-help-options':
                console.log('display-help-options');

            case 'display-cli-help':
                displayCliHelp(CLI_OPTIONS);

            default:
                getOptionSelection(CLI_OPTIONS);
                break;
        }
    } catch (e) {}
}

function getOptionSelection(cliOptions) {
    const cliOptionsKeys = Object.keys(cliOptions);
    console.log(cliOptionsKeys);
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What command would you like to run',
                choices: cliOptionsKeys,
            },
        ])
        .then((answers) => {
            console.info('Answer:', answers.command);
            return answers.command;
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
    } catch (err) {
        console.error(chalk.bold.red(err));
    }
}

function getPackageJsonScripts() {
    try {
        const data = fs.readFileSync('package.json', 'utf8');
        const packageJson = JSON.parse(data);
        const options = packageJson.scripts;
        return options;
    } catch (e) {
        console.error(e);
    }
}

function getOptionsFromFile() {
    try {
        const data = fs.readFileSync('help.json', 'utf8');
        const helpOptions = JSON.parse(data);
        return helpOptions;
    } catch (err) {
        console.error(chalk.bold.red(err));
    }
}

startup();
