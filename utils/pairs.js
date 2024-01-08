import Futures from '../lib/Futures.js';
import Config from '../lib/Config.js';
import chalk from 'chalk';

export const setExchangeAndUserInfo = async () => {
    const futures = new Futures();
    const conf = new Config();

    const positions = await futures.getAccountInformation();
    const pairs = await futures.getExchangeInformation();
    for (const position of positions) {
        const pair = pairs.find((pair) => pair.symbol === position.symbol);
        conf.setConfig(position.symbol, {
            leverage: position.leverage,
            isolated: position.isolated,
            quantityPrecision: pair.quantityPrecision,
        });
    }

    console.log(chalk.green('Exchange and user info updated'))
}

export const getExchangeAndUserInfo = async (symbol) => {
    const conf = new Config();
    const data = conf.getConfig(`${symbol}USDT`);

    if (!data) {
        throw new Error('Could not get ExchangeAndUserInfo');
    }

    return data;
}
