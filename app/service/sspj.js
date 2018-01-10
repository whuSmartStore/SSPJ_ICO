const Table = Symbol('SSPJ#table');

module.exports = app => {

    const Base = require('./base')(app);

    class SSPJ extends Base {

        // COnstructure of table sspj
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    type: undefined,
                    amount: undefined,
                    usage: undefined
                };
            }

            return this[Table];
        }


        // Judge sspj record exists or not
        async exists(type) {

            // parameter type doesn't exist
            if (!this._parameterExists(type)) {
                return false;
            }

            try {
                // sspj record exists
                if (await this._count('sspj', 'id', { type }) === 1) {
                    return true;
                }

                // sspj record doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Update sspj record info
        async update(sspj, wheres) {

            // format sspj's attributes to table sspj
            sspj = this._formatTableValue(this.table, sspj);

            // sspj's type doesn't exist
            if (!sspj.type) {
                return false;
            }

            // sspj has existed
            if (!await this.exists(sspj.type)) {
                return false;
            }

            // update sspj record's info
            try {
                await this._update('sspj', sspj, wheres);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Query sspj specified by type left amount
        async getLeft(type) {

            try {
                const sspj = await this._query('sspj', ['amount'], { type });
                return sspj[0] && +sspj[0].amount || 0;
            } catch (err) {
                this.logger.error(err);
                return 0;
            }
        }


        // Subtract the amount of some sspj specified by type with some number
        async sub(amount, type) {
            
            let left = this.getLeft(type);

            // sspjs left amount is inadequate
            if (left < amount) {
                return 'left sspj is inadequate'
            }

            left -= amount;
            if (!await this.update({ amount: left }, { type })) {
                return 'left sspj amount update successed';
            }

            return 'left sspj amount update failed';
        }
    }

    return SSPJ;
}