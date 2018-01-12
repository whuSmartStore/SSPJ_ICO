const path = require('path');

module.exports = appInfo => {

    const config = {

        middleware: ['recognize', 'referralMonitor', 'validate', 'response'],

        recognize: {
            match(ctx) {

                // get request url
                let flag = false;
                const url = ctx.request.url;

                // judge whether url is /public/login.html, /public/register.html, / or not
                if (url === '/public/login.html' || 
                    url === '/public/register.html' ||
                    url === '/') {
                    return true;
                }

                return false;
            }
        },

        // referralMonitor: {
            // match(ctx) {

            //     const url = ctx.request.url;

            //     // middleware referralMonitor just match request url '/'
            //     if (url === '/') {
            //         return true;
            //     }

            //     return false;
            // }
        //     match: '/'
        // },

        validate: {
            ignore(ctx) {

                // get request url
                let flag = false;
                const url = ctx.request.url;
                
                // judge request url is ignored or not
                if (appInfo.pkg.ignorePath[url]) {
                    flag = true;
                }

                // index test path ignore
                if (url.search(/index/i) !== -1) {
                    flag = true;
                }

                // sign path ignore
                if (url.search(/sign/i) !== -1) {
                    flag = true;
                }

                // path '/api/v1/users/exists/' ignore
                if (url.search('/api/v1/users/exists/') !== -1) {
                    flag = true;
                }

                return flag;
            },
        },
        
        keys: appInfo.name + 'sspj_ico_0001',

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
        duration: ['Main Sale', '2017-6-1 2017-10-1'],
        SSPJ: ['Sales Volume on Main Sale', 41333292],
        softCap: ['Soft-cap on Main Sale', '$ 12253000'],
        hardCap: ['Hard-cap on Main Sale', '8267 ETH'],
        salePrice: ['Main Sale price', '1 ETH = 5000 SSPJ(1 SSPJ = 0.0002 ETH)'],
        minPurchase: ['Minimum Purchase Transaction Sum', 0.01],
        maxPurchase: ['Maximum Purchase Transaction Sum', 'unlimited'],
    }

    return config;
}