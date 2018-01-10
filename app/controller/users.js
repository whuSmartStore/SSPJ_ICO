const crypto = require('crypto');
const validator = require('validator');

module.exports = app => {

    const Base = require('./base')(app);

    class User extends Base {

        // Index test
        async index() {
            this.response(200, 'index test successed');
        }


        // Judge some user exists or not(used to judge before register)
        async exists() {
            const email = this.ctx.params.username;
            const exists = await this.service.users.exists(email);
            this.response(200, { exists });
        }


        // Get investor's info
        async getUserInfo() {
            
            const email = this.ctx.cookies.get('username', {
                singed: true,
                encrypt: false
            });

            const user = await this.service.users.query(['firstName', 'lastName', 'address', 
                'ethAddress', 'ethAddressModifiable'], { email });
            this.response(200, user);
        }


        // Get SSPJ amount user invested
        async getSSPJ() {

            const email = this.ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });

            const sspj = await this.service.users.query(['firstName', 'sspj'], { email });
            this.response(200, sspj);
        }


        // Modify user's ico info
        async modifyUserInfo() {

            const email = this.ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });

            const user = this.ctx.reuqest.body;
            if (!await this.service.users.update(user, { email })) {
                this.response(403, `update user's info failed`);
                return;
            }

            this.response(203, `update user's info successed`);
        }


        // Active account(through validate email)
        sendEmail(email) {
            const token = crypto.createHmac('sha256', email).digest('hex');
            const url = `/api/v1/users/sign/auth/validateEmail?token=${token}`;

            //--------------- send email
        }


        // Resend email when user forget auth
        async resendEmailAuth() {
            
            const email = this.ctx.request.body.email;
            
            // user doesn't exist(email doesn't exists in table users)
            if (this.service.users.exists(email)) {
                this.response(403, `email doesn't exist`);
                return;
            }

            this.sendEmail(email);
            this.response(203, `please check your email(${email} to active your account`);
        }


        // Validate user's email
        async validateEmail() {
            
            const token = this.ctx.query.token;
            const email = crypto;           ///---------------------

            // token error
            if (!await this.service.users.exists(email)) {
                this.response(403, 'token error');
                return;
            }

            // auth failed
            if (!await this.service.users.update({ auth: true }, { email })) {
                this.response(403, 'active account failed');
                return;
            }

            this.response(203, 'active account successed');
        }


        // Register a new user
        async register() {

            // redirect to ico dashbord directly when cookie record exists
            if (await this.cookiesSetted()) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }

            const user = this.ctx.request.body;

            // user's email and password doesn't exist
            if (!user.email || !user.password) {
                this.response(403, 'email and password required');
                return;
            }

            // user's email format error
            if (!validator.isEmail(user.email)) {
                this.response(403, 'format of email error');
                return;
            }

            // generate user's info and encrypt some info
            user.token = crypto.createHmac('sha256', user.email).digest('hex');
            user.password = crypto.createHmac('sha256', user.password).digest('hex');
            user.createAt = Date.parse(new Date());
            user.sspj = 0;

            // add new user to table users
            if (!await this.service.users.insert(user)) {
                this.response(403, 'register failed');
                return;
            }

            // active account(through validate email) and redirect to login page
            this.sendEmail(user.email);
            this.ctx.redirect('/api/v1/users/sign/signIn/default');
        }


        // Redirect to password reset page
        async getresetPWPage() {
            const token = this.ctx.query.token;
            this.ctx.redirect(`/public/resetPW.html?token=${token}`);
        }


        // Reset password through email when user forget password
        async resetPasswd() {

            let password = this.ctx.request.body.password;
            const token = this.ctx.query.token;
            const email = crypto;                   ///--------------------------------------
            
            // Token error
            if (!await this.service.users.exists(email)) {
                this.response(403, 'token error');
                return;
            }

            // reset password
            password = crypto.createHmac('sha256', password).digest('hex');
            if (!await this.service.users.update({ password }, { email })) {
                this.response(403, 'reset password failed');
                return;
            }

            // set email and password to cookies and redirect to ico dashbord
            this.setCookies(email, password);
            this.ctx.redirect('/public/ico/dashbord.html');
        }


        // Resend email when user forget password
        async resendEmailPW() {

            // email doesn't exist in table users
            const email = this.ctx.request.body.email;
            if (!await this.service.users.exists(email)) {
                this.response(403, `user doesn't exist`);
                return;
            }

            // generate email token and url of password page
            const token = crypto.createHmac('sha256', email).digest('hex');
            const url = `/api/v1/users/sign/signIn/resetPWPage?token=${token}`;

            // ------ send email
        }

        
        // User logIn through default way
        async signIn() {
            
            // redirect to ico dashbord directly when cookie record exists
            if (await this.cookiesSetted()) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }
            
            // user logIn in common path
            const user = this.ctx.request.body;

            if (!user.email || !user.password) {
                this.response('email and password requried');
                return;
            }

            if (!await this.service.users.exists(user.email)) {
                this.response('user does not exist');
                return;
            }

            // redirect to activeAccount page when account hasn't been actived
            const auth = await this.service.users.query(['auth'], { email });
            if (auth === '{}' || auth.auth) {
                this.ctx.redirect(`/public/activeAccount.html?email=${user.email}`);
                return;
            }

            const secret = crypto.createHmac('sha256', user.password).digest('hex')
            const password = await this.service.users.getPasswd(user.email);
            
            if (password !== false && secret === password) {
                // set email and password to cookies and redirect to dashbord page
                this.setCookies(user.email, password);
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }
            
            this.response(403, 'password error');
        }


        // User logIn through google
        async signInGoogle() {
            
            // redirect to ico dashbord directly when cookie record exists
            if (await this.cookiesSetted()) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }

            // user logIn with google account
            this.response(200, 'waited to complete');  //-------------------------
        }


        // User logIn through facebook
        async signInFacebook() {

            // redirect to ico dashbord directly when cookie record exists
            if (await this.cookiesSetted()) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }

            // user logIn with google account
            this.response(200, 'waited to complete'); //----------------------------
        }


        // User logout
        async logout() {
            
            const username = this.ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });

            const password = this.ctx.cookies.get('password', {
                signed: true,
                encrypt: true
            });

            // if username or password exists in cookies remove them
            if (username || password) {
                this.ctx.cookies.set('username', null);
                this.ctx.cookies.set('password', null);
            }

            this.ctx.redirect('/public/register.html');
        }
    }

    return User;
}