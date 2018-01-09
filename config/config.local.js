

module.exports = appInfo => {

    const config = {

        cluster: {
            listen: {
                path: '',
                port: 7001,
                hostname: ''
            },
        }
    }

    config.db = {
        user: 'SSPJ_ICO',
        password: 'SSPJ_ICO_01',
        database: 'SSPJ_ICO',
        host: '127.0.0.1',
        port: '5432',
        poolSize: 5,
    };

    return config;
}