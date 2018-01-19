

module.exports = app => {
    
    app.get('/api/v1/icoInfo/index', 'icoInfo.index');
    
    app.get('/api/v1/icoInfo/info', 'icoInfo.getIcoInfo');
    app.get('/api/v1/icoInfo/startTime', 'icoInfo.getIcoStartTime');
    app.get('/api/v1/icoInfo/btcPrice', 'icoInfo.btcPrice');
    app.get('/api/v1/icoInfo/ethPrice', 'icoInfo.ethPrice');
}