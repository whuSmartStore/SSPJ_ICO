const path = require('path');

module.exports = appInfo => {

    const config = {

        middleware: ['response', 'referralMonitor', 'recognize', 'validate'],

        recognize: {
            match(ctx) {

                // get request url
                let flag = false;
                const url = ctx.request.url;

                // judge whether url is / or not
                if (url === '/') {
                    return true;
                }

                return false;
            }
        },

        referralMonitor: {
            match: '/'
        },

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

                // icoInfo ignore
                if (url.search(/icoInfo/i) !== -1) {
                    flag = true;
                }

                // sspj info ignore
                if (url.search(/sspj/i) !== -1) {
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

    config.bonuses = [
        {
            time: 1519889358000,
            bonus: 1
        },
        {
            time: 1519889514000,
            bonus: 0.5
        },
        {
            time: 1527866969000,
            bonus: 0.2
        },
        {
            time: 1529076569000,
            bonus: 0.15
        },
        {
            time: 1530458969000,
            bonus: 0.13
        },
        {
            time: 1531668569000,
            bonus: 0.11
        },
        {
            time: 1533137369000,
            bonus: 0.09
        },
        {
            time: 1534346969000,
            bonus: 0.07
        },
        {
            time: 1535815769000,
            bonus: 0.05
        },
        {
            time: 1537025369000,
            bonus: 0.03
        },
        {
            time: 1538407769000,
            bonus: 0
        }
    ];

    config.icoInfo = {
        duration: ['Main Sale', '2017-6-1 2017-10-1'],
        SSPJ: ['Sales Volume on Main Sale', 1200000000],
        softCap: ['Soft-cap on Main Sale', '240000 ETH'],
        hardCap: ['Hard-cap on Main Sale', '8267 ETH'],
        salePrice: ['Main Sale price', 5000],
        minPurchase: ['Minimum Purchase Transaction Sum', 0.01],
        maxPurchase: ['Maximum Purchase Transaction Sum', 'unlimited'],
    };

    // ETH imtoken Comman secret
    // btc blockChain Comman secret
    config.address = {
        eth: '0xe13cCeb9B98228d8434439E9F828B7906Ae9CF41',
    };

    config.token = {
        eth: 'N64H9R6X9XBE57USYIFFKYM649A33AEJRM',
    };

    return config;
}