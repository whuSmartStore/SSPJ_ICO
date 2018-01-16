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
                    block: undefined
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


        // Query the transaction info
        async query(attributes, wheres) {

            // format bills attributes to table bills
            bill = this._formatTableValue(this.table, bill);

            // query condition includes id or TXHash
            if (bill.id || bill.TXHash) {
                try {
                    const bill = await this._query('bills', attributes, wheres);
                    return bill[0] || {};
                } catch (err) {
                    this.logger.error(err);
                    return {};
                }
            }

            try {
                // query condition doesn't includes id and TXHash
                const bills = await this._query('bills', attributes, wheres);
                return bills;
            } catch (err) {
                return [];
            }
        }


        // Insert a bill record to table bills
        async insert(bill) {
        
            // format bill attributes to table structure
            bill = this._formatTableValue(this.table, bill);

            // user's email and transaction code doesn't exist
            if (!bill.email || !bill.TXHash) {
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