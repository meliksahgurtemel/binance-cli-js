#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Config from '../lib/Config.js';
import Order from '../lib/Order.js';

const isRequired = input => (input === '' ? 'This value is required' : true);

const config = {
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
}

program
    .name('Binance-CLI')
    .description('CLI to trade cryptocurrencies by using Binance APIs')
    .version('1.0.0')

program.command('config')
    .description('Manage config for api key and secret')
    // .argument('<apiKey>', 'Binance API Key')
    // .argument('<apiSecret>', 'Binance API Secret')
    .action(async () => {
        await config.setApiKey();
        await config.setApiSecret();
    });

program.command('spot')
    .description('Manage spot orders')
    .argument('<symbol>', 'Coin symbol')
    .argument('<quoteOrderQty>', 'USDT amount')
    .action(async (symbol, quoteOrderQty) => {
        const spot = new Order();
        const time = Date.now();
        await spot.placeOrder(symbol, 'BUY', 'MARKET', quoteOrderQty, time);
    });

program.parse();
