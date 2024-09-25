#!/usr/bin/env node
import { program } from 'commander';
import Order from '../lib/Order.js';
import Futures from '../lib/Futures.js';
import { configHelper } from '../utils/configHelper.js'
import { setExchangeAndUserInfo } from '../utils/pairs.js'

program
    .name('Binance Terminal')
    .description('CLI for trading cryptocurrencies by using Binance API')
    .version('1.0.4')

program.command('config')
    .description('configurations')
    .action(async () => {
        await configHelper.setApiKey();
        await configHelper.setApiSecret();
        await configHelper.setDefaultLeverage();
        await configHelper.setDefaultMarginType();
        await setExchangeAndUserInfo();
    });

program.command('update')
    .description('updates necessary values for the user')
    .action(async () => {
        await setExchangeAndUserInfo();
    });

program.command('s')
    .description('spot')
    .argument('<side>', 'BUY or SELL side')
    .argument('<symbol>', 'coin symbol')
    .argument('<quoteOrderQty>', 'USDT amount')
    .action(async (side, symbol, quoteOrderQty) => {
        const spot = new Order();
        const time = Date.now();
        await spot.placeOrder(
            symbol,
            side,
            'MARKET',
            quoteOrderQty,
            time
        );
    });

program.command('f')
    .description('futures')
    .argument('<symbol>', 'coin symbol')
    .argument('<side>', 'type l for Long, s for Short')
    .argument('<quoteOrderQty>', 'USDT amount')
    .option('-l', '--leverage', 'adjust leverage')
    .option('-t', '--type', 'change margin type (CROSSED or ISOLATED)')
    .action(async (symbol, side, quoteOrderQty) => {
        const futures = new Futures();
        const options = program.opts();
        await futures.placeOrder(
            symbol,
            side,
            quoteOrderQty,
            options
        );
    });

program.parse(process.argv);
