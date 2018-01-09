const Table = Symbol('Bills#table');

module.exports = app => {

    const Base = require('./base')(app);

    class Bills extends Base {

        // Bills table structure
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    email: undefined,
                    paid: undefined,
                    payType: undefined,
                    type: undefined,
                    sspj: undefined,
                    createAt: undefined,
                    TXHash: undefined,
                }
            }

            return this[Table];
        }


        // Judge bill record exists or not
        async exists(TXHash) {

            // TXHash doesn't exists
            if (!this._parameterExists(TXHash)) {
                return false;
            }

            try {
                // bill record exists
                if (await this._count('bills', 'id', { TXHash }) === 1) {
                    return true;
                }

                // bill record doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Insert a bill record to table bills
        async insert(bill) {
        
            // format bill attributes to table structure
            const bill = this.formatTableValue(this.table, bill);
            bill.createAt = Date.parse(new Date());        

            // user's email and transaction code doesn't exist
            if (!email || !TXHash) {
                return false;
            }

            // transaction exists
            if (await this.exists(bill.TXHash)) {
                return false;
            }

            // insert a bill record to table bills
            try {
                await this._insert('bills', bill);
                return true;
            } catch (err) {
                this.logger.error(error);
                return false;
            }
        }


        // Insert a eth transaction record to table bills
        async ethInsert(bill) {

            bill.payType = 'ETH';
            return await this.insert(bill);
        }


        // Insert a btc transaction record to table bills
        async btcInsert(bill) {

            bill.payType = 'BTC';
            return await this.insert(bill);
        }


        // Insert a ltc transaction record to table bills
        async ltcInsert(bill) {

            bill.payType = 'LTC';
            return await this.insert(bill);
        }
    }

    return Bills;
}