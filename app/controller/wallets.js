

module.exports = app => {

    const Base = require('./base')(app);

    class Wallets extends Base {

        async index() {
            this.response(200, 'index test sueccessed');
        }
    }

    return Wallets;
}