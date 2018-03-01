

module.exports = app => {

    app.get('/api/v1/sspj/index', 'sspj.index');

    app.get('/api/v1/sspj/icoProgress', 'sspj.getICOProgess');
}