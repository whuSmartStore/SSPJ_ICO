

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
        user: 'sspj_ico',
        database: 'sspj_ico',
        password: 'sspj_ico_11',
        host: '127.0.0.1',
        port: '5432',
        poolSize: 5
    };

    return config;
}