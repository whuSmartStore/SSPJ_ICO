

module.exports = app => {

    app.get('/api/v1/bills/index', 'bills.index');

    app.get('/api/v1/bills/info/transactionInfo', 'bills.getTransactionInfo');
}