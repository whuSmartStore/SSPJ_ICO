const pgp = require('pg-promise')();
const PGP = Symbol('application#pg-promise');
const ETHTXHash = Symbol('application#ethTXHash');
const BTCTXhash = Symbol('application#btcTXHash');
const LTCTXHash = Symbol('application#LTCTXHash');


module.exports = {

    get db() {
        if (!this[PGP]) {
            this[PGP] = pgp(this.config.db);
        }

        return this[PGP];
    },

    get ethTXHash() {
        if (!this[ETHTXHash]) {
            this[ETHTXHash] = {};
        }

        return this[ETHTXHash];
    },
    
    get btcTXHash() {
        if (!this[BTCTXhash]) {
            this[BTCTXhash] = {};
        }

        return this[BTCTXhash];
    },

    get ltcTXHash() {
        if (!this[LTCTXHash]) {
            this[LTCTXHash] = {};
        }

        return this[LTCTXHash];
    }
}