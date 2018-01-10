

module.exports = app => {

    app.get('/api/v1/users/index', 'users.index');

    app.redirect('/', '/api/v1/users/sign/register');
    
    app.get('/api/v1/users/exists/:username', 'users.exists');
    app.get('/api/v1/users/info/userInfo', 'users.getUserInfo');
    app.get('/api/v1/users/info/sspj', 'users.getSSPJ');
    app.put('/api/v1/users/info/userInfo', 'users.modifyUserInfo');
    app.put('/api/v1/users/info/validateEmail', 'users.validateEmail');

    app.post('/api/v1/users/sign/register', 'users.register');
    app.post('/api/v1/users/sign/signIn/default', 'users.signIn');
    app.post('/api/v1/users/sign/signIn/google', 'users.signInGoogle');
    app.post('/api/v1/users/sign/signIn/faceBook', 'users.signInFacebook');
    app.delete('/api/v1/users/sign/logout', 'users.logout');
}



// app.put('/api/v1/users/info/userInfo', 'users.modifyUserInfo');
// {
//     firstName,
//     lastName,
//     address,
//     ethAddress
// }


// app.post('/api/v1/users/sign/register', 'users.register');
// {
//     email,
//     password
// }



// app.post('/api/v1/users/sign/signIn', 'users.signIn');
// {
//     email,
//     password
// }



// app.post('/api/v1/users/sign/signIn/google', 'users.signInGoogle');
// {
//     email,
//     password
// }



// app.post('/api/v1/users/sign/signIn/faceBook', 'users.signInFacebook');
// {
//     email,
//     password
// }



// app.delete('/api/v1/users/sign/logout', 'users.logout');
// {

// }