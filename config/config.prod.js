

module.exports = appInfo => {

    const config = {

        cluster: {
            listen: {
                path: '',
                port: 7002,
                hostname: '',
            }
        }
    }

    config.db = {
        user: 'SSPJ_ICO',
        database: 'SSPJ_ICO',
        password: 'SSPJ_ICO_11',
        host: '127.0.0.1',
        port: '5432',
        poolSize: 5
    };

    return config;
}