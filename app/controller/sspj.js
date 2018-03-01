

module.exports = app => {

    const Base = require('./base')(app);

    class SSPJ extends Base {

        async index() {
            this.response(200, 'index test successed');
        }

        async getWhitePaperEN() {
            this.response(200, 'test get white paper en successed');
        }

        async getWhitePaperCN() {
            this.response(200, 'test get white paper cn successed');
        }

        async getFAQ() {
            this.response(200, 'test get faq successed');
        }
    }

    return SSPJ;
}