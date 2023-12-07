import { Spot } from '@binance/connector';
import Config from './Config.js';
import chalk from 'chalk';

class Order {
    constructor() {
        const conf = new Config();
        const apiKey = conf.getConfig('apiKey');
        const apiSecret = conf.getConfig('apiSecret');
        this.client = new Spot(apiKey, apiSecret);
    }

    async placeOrder(symbol, side, type, quoteOrderQty, time) {
        try {
            const res = await this.client.newOrder(`${symbol}USDT`, side, type, {
                quoteOrderQty: quoteOrderQty
            });
            const executionTime = res.data.transactTime - time;
            this.client.logger.log('✅ Order ' + chalk.green(`${res.data.status}`));
            this.client.logger.log('🤖 Executed in ' + chalk.yellow(`${executionTime}`) + ' ms');
            return res;
        } catch (err) {
            throw new Error(chalk.red('!') + ` Execution failed. Reason: ${err}`)
        }
    }
}

export default Order;
