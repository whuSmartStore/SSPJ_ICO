

module.exports = app => {

    require('./router/bills')(app);
    require('./router/followers')(app);
    require('./router/icoInfo')(app);
    require('./router/questions')(app);
    require('./router/sspj')(app);
    require('./router/users')(app);
    require('./router/wallets')(app);
    require('./router/wtypes')(app);
}