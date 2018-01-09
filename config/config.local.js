

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
        user: 'sspj_ico',
        password: 'sspj_ico_01',
        database: 'sspj_ico',
        host: '127.0.0.1',
        port: '5432',
        poolSize: 5,
    };

    return config;
}