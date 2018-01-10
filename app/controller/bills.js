


module.exports = app => {

    const Base = require('./base')(app);

    class Bills extends Base {

        async index() {
            this.response(200, 'index test successed');
        }
    }

    return Bills;
}