

module.exports = app => {
    
    app.get('/api/v1/icoInfo/index', 'icoInfo.index');
    
    app.get('/api/v1/icoInfo/info', 'icoInfo.getIcoInfo');
    app.get('/api/v1/icoInfo/startTime', 'icoInfo.getIcoStartTime');
    app.get('/api/v1/icoInfo/btcPrice', 'icoInfo.btcPrice');
    app.get('/api/v1/icoInfo/ethPrice', 'icoInfo.ethPrice');
    app.get('/api/v1/icoInfo/whitepaper/en', 'icoInfo.getWhitePaperEN');
    app.get('/api/v1/icoInfo/whitepaper/cn', 'icoInfo.getWhitePaperCN');
    app.get('/api/v1/icoInfo/faq/en', 'icoInfo.getFAQEN');
    app.get('/api/v1/icoInfo/faq/cn', 'icoInfo.getFAQCN');
}