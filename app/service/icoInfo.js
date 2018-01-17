

module.exports = app => {

    const Base = require('./base')(app);

    class IcoInfo extends Base {

        // Get the price of BTC(price based on kucoin exchange)
        async btcPrice() {
            
            const response = await this.ctx.curl('https://api.kucoin.com/v1/open/currencies?coins=BTC', {
                dataType: 'json',
                timeout: 1000 * 60
            });
            const data = response.data;
            const price = data.data && data.data.rates && data.data.rates.BTC && data.data.rates.BTC.CNY || '--';
            return price;
        }


        // Get the price of ETH(price based on kucoin exchange)
        async ethPrice() {

            const response = await this.ctx.curl('https://api.kucoin.com/v1/open/currencies?coins=ETH', {
                dataType: 'json',
                timeout: 1000 * 60 
            });
            const data = response.data;
            const price = data.data && data.data.rates && data.data.rates.ETH && data.data.rates.ETH.CNY || '--';
            return price;
        }


        // Get the rate of BTC/ETH
        async btcEthRate() {

            const btc = await this.btcPrice();
            const eth = await this.ethPrice();
            if (btc === '--' || eth === '--' || !btc || !eth) {
                return 10;
            }

            return btc / eth;
        }
    }

    return IcoInfo;
}