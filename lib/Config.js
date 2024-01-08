import Configstore from 'configstore';

class Config {
    constructor() {
        this.config = new Configstore('binance-terminal');
    }

    setConfig(prop, value) {
        this.config.set(prop, value);
        return value;
    }

    getConfig(prop) {
        const data = this.config.get(prop);

        if (!data) {
            throw new Error(`${prop} has not been set`);
        }

        return data;
    }

    deleteConfig(prop) {
        const data = this.config.get(prop);

        if (!data) {
            throw new Error(`${prop} has not been set`);
        }

        this.config.delete(prop);
    }
}

export default Config;
