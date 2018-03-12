

module.exports = app => {

    const Base = require('./base')(app);

    class SSPJ extends Base {

        // Index test
        async index() {
            this.response(200, 'index test successed');
        }


        // Get Smart Supermarket ICO progress
        async getICOProgress() {
            
            const stage = this.service.sspj.getStage(Date.parse(new Date()));

            // Smart Supermarket ICO doesn't start
            if (stage <= 0) {
                this.response(200, {
                    start: false,
                    message: `ICO starts at ${this.config.bonuses[stage].time}`
                });
                return;
            }

            // Judge which stage ico in, 1: pravite sale, 2: pre sale, 3: public sale
            const sspj = {};
            switch (stage) {
                case 1:
                    sspj.stageIn = 'private sale';
                    sspj.amount = 120000000;
                    break;
                case 2:
                    sspj.stageIn = 'pre sale';
                    sspj.amount = 360000000;
                    break;
                default:
                    sspj.stageIn = 'public sale';
                    sspj.amount = 70000000;
                    break;
            }

            // Get sspj remain number
            sspj.left = this.service.sspj.getLeft(`investor_${stage}`);
            this.response(200, {
                start: true,
                sspj
            });
        }

    }

    return SSPJ;
}