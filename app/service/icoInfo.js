

module.exports = app => {

    const Base = require('./base')(app);

    class IcoInfo extends Base {

        // Get the price of BTC(price based on kucoin exchange)
        async btcPrice() {
            
            const response = await this.ctx.curl('https://api.coinmarketcap.com/v1/ticker/bitcoin/', {
                dataType: 'json',
                timeout: 1000 * 60
            });
            const data = response.data;
            const price = data[0] && data[0].price_usd || '--';
            return price;
        }


        // Get the price of ETH(price based on kucoin exchange)
        async ethPrice() {

            const response = await this.ctx.curl('https://api.coinmarketcap.com/v1/ticker/ethereum/', {
                dataType: 'json',
                timeout: 1000 * 60 
            });
            const data = response.data;
            const price = data[0] && data[0].price_usd || '--';
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