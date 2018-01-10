

module.exports = app => {

    const Base = require('./base')(app);

    class Followers extends Base {

        async index() {
            this.response(200, 'index test successed');
        }
    }

    return Followers;
}