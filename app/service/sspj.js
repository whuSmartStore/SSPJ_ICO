const Table = Symbol('SSPJ#table');

module.exports = app => {

    const Base = require('./base')(app);

    class SSPJ extends Base {

        // COnstructure of table sspj
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    usage: undefined,
                    total: undefiend,
                    amount: undefined,
                    rate: undefined,
                    remain: undefined
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


        // Get some sspj specified by usage remain amount
        async getLeft(usage) {

            try {
                const sspj = await this._query('sspj', ['remain'], { usage });
                return sspj[0] && +sspj[0].remain || 0;
            } catch (err) {
                this.logger.error(err);
                return 0;
            }
        }


        // Subtract the amount of some sspj specified by type with some number
        async sub(amount, usage) {
            
            let left = this.getLeft(usage);

            // sspjs left amount is inadequate
            if (left < amount) {
                return false;
            }

            try {
                left -= amount;
                if (!await this.update({ remain: left }, { usage })) {
                    return false;
                }

                return true;
            } catch (err) {
                this.logger.error('update sspj left amount failed');
                return false;
            }
        }


        // Get the bonuses rate according to the datatime
        getBonusRate(timestamp) {
            
            const len = this.config.bonuses.length;

            for (let i = 0; i < len - 2; i++) {
                console.log(i);
                if (timestamp < this.config.bonuses[i + 1].time) {
                    console.log(this.config.bonuses[i].bonus);
                    return this.config.bonuses[i].bonus;
                }
            }

            if (timestamp >= this.config.bonuses[len -1].time) {
                return this.config.bonuses[len - 1].bonus;
            }
        }
    }

    return SSPJ;
}