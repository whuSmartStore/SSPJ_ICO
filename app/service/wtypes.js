const Table = Symbol('Wtypes#table');

module.exports = app => {

    const Base = require('./base')(app);

    class Wtypes extends Base {

        // Structure of table wtypes
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    type: undefined
                };

                return this[Table];
            }
        }


        // Judge wtype record exists or not
        async exists(type) {

            // parameter type doesn't exist
            if (!this._parameterExists(type)) {
                return false;
            }

            try {
                // some wallet type specified by type exist
                if (await this._count('wtypes', 'id', { type }) === 1) {
                    return true;
                }

                // some wallet type specified by type doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Get all wallet type
        async query() {

            try {
                const wtypes = await this._query('wtypes', ['type'], {});
                return wtypes;
            } catch (err) {
                this.logger.error(err);
                return [];
            }
        }


        // insert a new wallet type to table wtypes 
        async insert(wtype) {
            
            // format wtype's attributes to table wtypes
            wtype = this._formatTableValue(this.table, wtype);

            // wtype's type doesn't exist
            if (!wtype.type) {
                return false;
            }

            // wtype record has existed
            if (await this.exists(wtype.type)) {
                return false;
            }

            // insert a new wallet type record to table wtypes
            try {
                await this._insert('wtypes', wtype);
                return true;
            } catch (err) {
                return false;
            }
        }


        // Delete some ctype record satisfied some condition 
        async delete(wheres) {

            // format wheres attributes to table wtypes
            wheres = this._formatTableValue(this.table, wheres);

            // wtype record's type doesn't exist
            if (!wheres.type) {
                return false;
            }

            // wtype record doesn't exist
            if (!await this.exists(wheres.type)) {
                return false;
            }

            // delete wtype record satisfied condition
            try {
                await this._delete('wtypes', wheres);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }
    }

    return Wtypes;
}