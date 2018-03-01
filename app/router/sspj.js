

module.exports = app => {

    app.get('/api/v1/sspj/index', 'sspj.index');

    app.get('/api/v1/sspj/whitepaper/en', 'sspj.getWhitePaperEN');
    app.get('/api/v1/sspj/whitepaper/cn', 'sspj.getWhitePaperCN');
    app.get('/api/v1/sspj/faq', 'sspj.getFAQ');
}