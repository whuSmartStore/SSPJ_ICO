

module.exports = appInfo => {

    const config = {

        cluster: {
            listen: {
                path: '',
                port: 7003,
                hostname: '',
            }
        }
    }

    config.db = {
        user: 'sspj_ico',
        database: 'sspj_ico',
        password: 'sspj_ico_01',
        host: '127.0.0.1',
        port: '5432',
        poolSize: 5
    };

    config.dns = {
        host: '121.201.13.217',
        port: '27002',
        domain: ''
    };

    return config;
}