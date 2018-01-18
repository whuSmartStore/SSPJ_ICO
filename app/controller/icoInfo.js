

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
        

        // Get the ICO's start time
        async getIcoStartTime() {
            const startTime = this.app.config.bunoses[0].time;
            this.response(200, { startTime });
        }


        // Get btc price
        async btcPrice() {
            const price = await this.service.icoInfo.btcPrice();
            this.response(200, { price });
        }

        // Get eth price
        async ethPrice() {
            const price = await this.service.icoInfo.ethPrice();
            this.response(200, { price });
        }
    }

    return IcoInfo;
}