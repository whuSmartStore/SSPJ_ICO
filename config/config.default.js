const path = require('path');

module.exports = appInfo => {

    const config = {

        // middleware: ['validate', ],

        // validate: {
        //     ignore(ctx) {
        //         let flag = false;
        //         const url = ctx.request.url; 
        //     },
        // },
        
        keys: appInfo.name + Date.parse(new Date()),

        security: {
            csrf: false
        },

        name: appInfo.name,

        pkg: appInfo.pkg,

        dir: appInfo.baseDir,

        rundir: path.join(appInfo.baseDir, '../info/run'),

        logger: {
            dir: path.join(appInfo.baseDir, '../info/log'),
        },

        notfound: {
            pageUrl: '/public/404.html'
        },

        cluster: {
            listen: {
                path: '',
                port: 7001,
                hostname: '',
            }
        },
    }

    config.db = {
        user: 'sspj_ico',
        password: 'sspj_ico_11',
        database: 'sspj_ico',
        host: '121.201.13.217',
        port: '25432',
        poolSize: 50
    }

    config.bunoses = [
        {
            time: 1515559629000,
            buons: 0.2,
            amount: 13777764
        },
        {
            time: 1515559659000,
            buons: 0.15,
            amount: 13777764
        },
        {
            time: 1515559684000,
            buons: 0.13,
            amount: 13777764
        },
        {
            time: 1515559707000,
            buons: 0.11,
            amount: 13777764
        },
        {
            time: 1515559720000,
            buons: 0.09,
            amount: 13777764
        },
        {
            time: 1515559738000,
            buons: 0.07,
            amount: 13777764
        },
        {
            time: 1515559756000,
            buons: 0.05,
            amount: 13777764
        },
        {
            time: 1515559773000,
            buons: 0.03,
            amount: 13777764
        },
        {
            time: 1515559787000,
            buons: 0,
            amount: 27555528
        }
    ];

    config.icoInfo = {
        duration: '2017-6-1 2017-10-1',
        SSPJ: 41333292,
        softCap: '$ 12253000 ',
        hardCap: '8267 ETH',
        salePrice: '1 ETH = 5000 SSPJ(1 SSPJ = 0.0002 ETH)',
        minPurchase: 0.01,
        maxPurchase: 'unlimited'
    }

    return config;
}