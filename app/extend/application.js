const pgp = require('pg-promise')();
const PGP = Symbol('application#pg-promise');

module.exports = {

    get db() {
        if (!this[PGP]) {
            this[PGP] = pgp(this.config.db);
        }

        return this[PGP];
    }
}