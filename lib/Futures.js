import { UMFutures } from '@binance/futures-connector'
import Config from './Config.js';
import chalk from 'chalk';
import { errLogger } from '../utils/logger.js';
import { configHelper } from '../utils/configHelper.js'
import { getExchangeAndUserInfo, setExchangeAndUserInfo } from '../utils/pairs.js';

class Futures {
    constructor() {
        const conf = new Config();
        const apiKey = conf.getConfig('apiKey');
        const apiSecret = conf.getConfig('apiSecret');
        this.client = new UMFutures(apiKey, apiSecret, {
            baseURL: 'https://fapi.binance.com'
        });
    }

    async changeMargin(symbol, type) {
        try {
            const { status } = await this.client.changeMarginType(`${symbol}USDT`, type);
            return status;
        } catch (err) {
            errLogger(err);
        }
    }

    async changeLeverage(symbol, leverage) {
        try {
            const { status } = await this.client.changeInitialLeverage(`${symbol}USDT`, leverage);
            return status;
        } catch (err) {
            console.log(err)
            errLogger(err);
        }
    }

    async getAccountInformation() {
        try {
            const { data } = await this.client.getAccountInformationV2();
            return data.positions;
        } catch (err) {
            errLogger(err);
        }
    }

    async getExchangeInformation() {
        try {
            const { data } = await this.client.getExchangeInfo();
            return data.symbols;
        } catch (err) {
            errLogger(err);
        }
    }

    async getPrice(symbol) {
        try {
            const { data } = await this.client.getPriceTicker(`${symbol}USDT`);
            return data.price
        } catch (err) {
            errLogger(err);
        }
    }

    async placeOrder(symbol, side, quoteOrderQty, options) {
        const time = Date.now();

        let leverage;
        let marginType;
        let orderSide;

        if (!['s', 'l'].includes(side.toLowerCase())) throw new Error('Type either s or l');

        symbol = symbol.toUpperCase();
        orderSide = side.toLowerCase() === 's' ? 'SELL' : 'BUY'
        leverage = options.leverage ? options.leverage : configHelper.getDefaultLeverage();
        marginType = options.type ? options.type : configHelper.getDefaultMarginType();

        const data = await getExchangeAndUserInfo(symbol);
        if (data.leverage !== leverage) {
            await this.changeLeverage(symbol, leverage)
        }

        let currentMarginType = data.isolated ? 'ISOLATED' : 'CROSSED';
        if (currentMarginType !== marginType.toUpperCase()) {
            await this.changeMargin(symbol, marginType)
        }

        try {
            const price = await this.getPrice(symbol);
            const quantity = (quoteOrderQty * leverage) / price;

            const res = await this.client.newOrder(`${symbol}USDT`, orderSide, 'MARKET', {
                quantity: quantity.toFixed(data.quantityPrecision)
            });

            const executionTime = res.data.updateTime - time;
            this.client.logger.log('✅ Order ' + chalk.green('FILLED'))
            this.client.logger.log('🤖 Executed in ' + chalk.yellow(`${executionTime}`) + ' ms');
        } catch (err) {
            errLogger(err);
        }

        await setExchangeAndUserInfo();
    }
}

export default Futures;
