

module.exports = app => {

    app.get('/api/v1/followers/index', 'followers.index');

    app.get('/api/v1/followers/myFollowers', 'followers.myFollowers');
    app.get('/api/v1/followers/myReferralLink', 'followers.myReferralLink');
}