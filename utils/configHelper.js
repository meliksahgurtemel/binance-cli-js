import inquirer from 'inquirer';
import chalk from 'chalk';
import Config from '../lib/Config.js';
import { isRequired, isRequiredAndCorrect, isRequiredAndWithinRange } from './validations.js'

export const configHelper = {
    async setApiKey() {
        const conf = new Config();
        const input = await inquirer.prompt([
            {
              type: 'input',
              name: 'key',
              message: chalk.blue('Enter API Key'),
              validate: isRequired
            }
        ]);

        const key = conf.setConfig('apiKey', input.key);
        if (key) {
            console.log(chalk.green('API key is set'));
        }
    },

    deleteApiKey() {
        const conf = new Config();
        conf.deleteConfig('apiKey');

        console.log(chalk.green('API key is deleted'))
    },

    async setApiSecret() {
        const conf = new Config();
        const input = await inquirer.prompt([
            {
              type: 'input',
              name: 'key',
              message: chalk.blue('Enter API Secret'),
              validate: isRequired
            }
        ]);

        const key = conf.setConfig('apiSecret', input.key);
        if (key) {
            console.log(chalk.green('API secret is set'));
        }
    },

    deleteApiSecret() {
        const conf = new Config();
        conf.deleteConfig('apiSecret');

        console.log(chalk.green('API secret is deleted'))
    },

    async setDefaultLeverage() {
        const conf = new Config();
        const input = await inquirer.prompt([
            {
              type: 'input',
              name: 'key',
              message: chalk.blue('Determine your default leverage'),
              validate: isRequiredAndWithinRange
            }
        ]);

        const key = conf.setConfig('leverage', input.key);
        if (key) {
            console.log(chalk.green('Leverage is set'));
        }
    },

    async setDefaultMarginType() {
        const conf = new Config();
        const input = await inquirer.prompt([
            {
              type: 'input',
              name: 'key',
              message: chalk.blue('Determine your default margin type (Isolated or Crossed)'),
              validate: isRequiredAndCorrect
            }
        ]);

        const key = conf.setConfig('marginType', input.key);
        if (key) {
            console.log(chalk.green('Margin type is set'));
        }
    },

    getDefaultLeverage() {
        const conf = new Config();
        const data = conf.getConfig('leverage');
        return data;
    },

    getDefaultMarginType() {
        const conf = new Config();
        const data = conf.getConfig('marginType');
        return data;
    }
}
