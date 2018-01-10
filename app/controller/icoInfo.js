

module.exports = app => {

    const Base = require('./base')(app);

    class IcoInfo extends Base {

        // Index test
        async index() {
            this.response(200, 'index test successed');
        }


        // Get the ICO info of SSPJ
        async getIcoInfo() {
            const ico = this.app.config.icoInfo;
            ico.bunoses = this.app.config.bunoses;
            this.response(200, ico);
        }
        
    }

    return IcoInfo;
}