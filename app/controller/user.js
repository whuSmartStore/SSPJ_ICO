

module.exports = app => {

    const Base = require('./base')(app);

    class User extends Base {

        index() {
            console.log(this.app.db);
            this.response(200, 'index test successed');
        }
    }

    return User;
}