const Table = Symbol('Wallets#table');

module.exports = app => {

    const Base = require('./base')(app);

    class Wallets extends Base {

        // Structure of table wallets
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    wtype: undefined,
                    address: undefined
                };
            }

            return this[Table];
        }


        // Judge some wallet exists or not
        async exists(address) {

            // parameter address doesn't exist
            if (!this._parameterExists(address)) {
                return false;
            }

            try {
                // wallet specified by address exists
                if (await this._count('wallets', 'id', { address }) === 1) {
                    return true;
                }

                // wallet specified by address doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Add a new wallet to table wallets
        async insert(wallet) {

            // format wallet attributes to table walltes
            wallet = this._formatTableValue(this.table, wallet);

            // wallet's wtype and address doesn't exist
            if (!wallet.wtype || !wallet.address) {
                return false;
            }

            // wallet record has exsited
            if (await this.exists(wallet.address)) {
                return false;
            }

            // add new wallet to table wallets
            try {
                await this._insert('wallets', wallet);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // delete some wallets satisfied some condition
        async delete(wheres) {

            // format wheres attributes to table wallets
            wheres = this._formatTableValue(this.table, wheres);

            // wallet's address doesn't exist
            if (!wheres.address) {
                return false;
            }

            // wallet doesn't exist in table wallets
            if (await this.exists(wheres.address)) {
                return false;
            }

            // delete all wallets satisfied the condition
            try {
                await this._delete('wallets', wheres);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Get all wallet address of some coin type(the type of coin we accepted)
        async getSomeTypeWallets(type) {

            try {
                // get all wallets address from table wallets specified by coin type
                const wallets = await this._query('wallets', ['address'], { wtype: type });

                // generate address value array which just includes address value
                let warr = [];
                for (const wallet of wallets) {
                    warr.push(wallet.address);
                }
                return warr;
            } catch (err) {
                this.logger.error(err);
                return [];
            }
        }


        // Get all ETH wallets address accepted eth
        async getETHWallets() {
            return await this.getSomeTypeWallets('ETH');
        }


        // Get all BTC wallets address accepted btc
        async getBTCWallet() {
            return await this.getSomeTypeWallets('BTC');
        }


        // Get all LTC wallets address accepted ltc
        async getLTCWallet() {
            return await this.getSomeTypeWallets('LTC');
        }
    }

    return Wallets;
}