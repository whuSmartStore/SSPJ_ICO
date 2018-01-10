

module.exports = app => {

    app.get('/api/v1/users/index', 'users.index');

    app.redirect('/', '/public/register.html', 302);
    
    app.get('/api/v1/users/exists/:username', 'users.exists');
    
    app.get('/api/v1/users/info/userInfo', 'users.getUserInfo');
    app.get('/api/v1/users/info/sspj', 'users.getSSPJ');
    app.put('/api/v1/users/info/userInfo', 'users.modifyUserInfo');

    app.put('/api/v1/users/sign/auth/validateEmail', 'users.validateEmail'); // ?token=:string
    app.post('/api/v1/users/sign/auth/activeAccount', 'users.resendEmailAuth');

    app.post('/api/v1/users/sign/register', 'users.register');
    
    app.get('/api/v1/users/sign/signIn/resetPWPage', 'users.getresetPWPage'); // ?token=:string
    app.put('/api/v1/users/sign/signIn/resetPasswd', 'users.resetPasswd'); // ?token=:string
    app.post('/api/v1/users/sign/signIn/forgetPasswd', 'users.resendEmailPW');

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



// app.put('/api/v1/users/sign/auth/validateEmail', 'users.validateEmail'); // ?token=:string
// {

// }



// app.post('/api/v1/users/sign/auth/activeAccount', 'users.resendEmailAuth');
// {
//     email
// }



// app.post('/api/v1/users/sign/register', 'users.register');
// {
//     email,
//     password
// }



// app.put('/api/v1/users/sign/signIn/resetPasswd', 'users.resetPasswd');
// {
//     password
// }



// app.post('/api/v1/users/sign/signIn/forgetPasswd', 'users.resendEmailPW');
// {
//     email
// }



// app.post('/api/v1/users/sign/signIn/default', 'users.signIn');
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