const path = require('path');

module.exports = appInfo => {

    const config = {
        
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
        user: '',
        password: '',
        database: '',
        host: '',
        port: '',
        poolSize: 50
    }

    return config;
}