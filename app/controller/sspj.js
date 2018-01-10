

module.exports = app => {

    const Base = require('./base')(app);

    class SSPJ extends Base {

        async index() {
            this.response(200, 'index test successed');
        }
    }

    return SSPJ;
}