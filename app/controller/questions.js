

module.exports = app => {

    const Base = require('./base')(app);

    class Questions extends Base {

        async index() {
            this.response(200, 'index test successed');
        }
    }

    return Questions;
}