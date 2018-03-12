const path = require('path');
const fs = require('fs');


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
            const startTime = this.config.bonuses[0].time;
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


        // Response static file in doc directory
        getFile(filename) {
            const filePath = path.resolve(this.config.dir, `./doc/${filename}`);
            this.ctx.attachment(`SSPJ_${filename}`);
            this.ctx.set('Content-Type', 'application/octet-stream');
            this.ctx.body = fs.createReadStream(filePath);
        }


        // Get English whitepaper
        getWhitePaperEN() {
            this.getFile('whitepaper.pdf');
        }


        // Get Chinese whitepaper
        getWhitePaperCN() {
            this.getFile('白皮书.pdf');
        }


        // Get English frequent questions 
        getFAQEN() {
            this.getFile('faq.pdf');
        }


        // Get Chinese freuest questions
        getFAQCN() {
            this.getFile('常见问题.pdf');
        }
    }

    return IcoInfo;
}