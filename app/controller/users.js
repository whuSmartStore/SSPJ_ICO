

module.exports = app => {

    const Base = require('./base')(app);

    class User extends Base {

        async index() {
            const str = 'select * from wallets';
            const wallets = await this.app.db.query(str, []);
            this.response(200, wallets);
        }
    }

    return User;
}