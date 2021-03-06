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
            
            const email = this.getEmail();

            const user = await this.service.users.query(['firstName', 'lastName', 'address', 
                'ethAddress', 'ethAddressModifiable'], { email });
            this.response(200, user);
        }


        // Get SSPJ amount user invested
        async getSSPJ() {

            const email = this.getEmail();

            const sspj = await this.service.users.query(['firstName', 'sspj'], { email });
            this.response(200, sspj);
        }


        // Modify user's ico info
        async modifyUserInfo() {

            const email = this.getEmail();
            const user = this.ctx.reuqest.body;
            
            // when user's ethAddress included change ethAddress to lowercase
            if (user.ethAddress) {
                user.ethAddress = user.ethAddress.toLowerCase();
            }

            if (!await this.service.users.update(user, { email })) {
                this.response(403, `update user's info failed`);
                return;
            }

            this.response(203, `update user's info successed`);
        }


        // Active account(through validate email)
        async sendEmail(email) {
            const token = this.service.crypto.encrypto(email);
            const url = `http://${this.config.dns.host}:${this.config.dns.port}/api/v1/users/sign/auth/validateEmail?token=${token}`;
            await this.service.email.activeAccount(email, url);
        }


        // Resend email when user forget auth
        async resendEmailAuth() {
            
            let email = this.ctx.request.body.email;
            
            // user doesn't exist(email doesn't exists in table users)
            if (this.service.users.exists(email)) {
                this.response(403, `email doesn't exist`);
                return;
            }

            email = await this.sendEmail(email);
            if (!email.send) {
                this.response(400, 'Email send failed');
                return;
            }

            this.response(203, `please check your email(${email} to active your account`);
        }


        // Validate user's email
        async validateEmail() {
            
            const token = this.ctx.query.token;
            

            // validate length of token right or not
            const tokLen = token.toString().length;
            if (tokLen !== 32 && tokLen !== 64 && token !== 128 && token !== 256) {
                this.response(403, 'token error');
                return;
            }

            const email = this.service.crypto.decrypto(token);

            // token error
            if (!await this.service.users.exists(email)) {
                this.ctx.redirect(`/public/validateEmail.html?code=403&info="validate_failed"`);
                return;
            }

            // auth failed
            if (!await this.service.users.update({ auth: true }, { email })) {
                this.ctx.redirect(`/public/validateEmail.html?code=403&info="validate_successed"`);
                return;
            }

            this.ctx.redirect(`/public/validateEmail.html?code=403&info="validate_failed"`);
        }


        // Register a new user
        async register() {

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
            user.token = this.service.crypto.generateToken(user.email);
            user.password = this.service.crypto.encrypto(user.password);
            user.createAt = Date.parse(new Date());
            user.sspj = 0;

            // add new user to table users
            if (!await this.service.users.insert(user)) {
                this.response(403, 'register failed');
                return;
            }

            // Judge if the investor referraled by some other
            const referral = this.getToken();
            this.setToken(null);
            if (referral) {
                await this.service.followers.insert({ token: referral, email: user.email });
            }

            // active account(through validate email) and redirect to login page
            await this.sendEmail(user.email);
            this.response(203, 'Email has beed sent, please check you email and click active link to active account');
        }


        // Redirect to password reset page
        async getresetPWPage() {
            const token = this.ctx.query.token;
            this.ctx.redirect(`http://${this.config.dns.host}:${this.config.dns.port}/public/resetPW.html?token=${token}`);
        }


        // Reset password through email when user forget password
        async resetPasswd() {

            let password = this.ctx.request.body.password;
            const token = this.ctx.query.token;

            // validate token is right or not
            const tokLen = token.toString().length;
            if (tokLen !== 32 && tokLen !== 64 && token !== 128 && token !== 256) {
                this.response(403, 'token error');
                return;
            }

            const email = this.service.crypto.decrypto(token);
            
            // Token error
            if (!await this.service.users.exists(email)) {
                this.response(403, 'token error');
                return;
            }

            // reset password
            password = this.service.crypto.encrypto(password);
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
            const token = this.service.crypto.encrypto(email);
            const url = `http://${this.config.dns.host}:${this.config.dns.port}/api/v1/users/sign/signIn/resetPWPage?token=${token}`;
            await this.service.email.resetPassword(email, url);
            this.response(203, 'Please check your email and reset your password');
        }

        
        // User logIn through default way
        async signIn() {

            // user logIn in common path
            const user = this.ctx.request.body;

            if (!user.email || !user.password) {
                this.response(403, 'email and password requried');
                return;
            }

            if (!await this.service.users.exists(user.email)) {
                this.response(403, 'user does not exist');
                return;
            }

            // redirect to activeAccount page when account hasn't been actived
            const auth = await this.service.users.query(['auth'], { email: user.email });
            if (auth === '{}' || !auth.auth) {
                this.response(403, `account haven't been activated, please click the active link to redirect active account page`);
                return;
            }

            const secret = this.service.crypto.encrypto(user.password);
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
            this.response(200, 'waited to complete');
        }


        // User logIn through facebook
        async signInFacebook() {

            // redirect to ico dashbord directly when cookie record exists
            if (await this.cookiesSetted()) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }

            // user logIn with google account
            this.response(200, 'waited to complete');
        }


        // User logout
        async logout() {
            
            const email = this.getEmail();

            const password = this.getPassword();

            // if email or password exists in cookies remove them
            if (email || password) {
                this.ctx.cookies.set('username', null);
                this.ctx.cookies.set('password', null);
            }

            this.ctx.redirect('/public/register.html');
        }


        // Confirm eth address modifiable or not
        async ethModifiable() {
            const email = this.getEmail();
            let modifiable = await this.service.users.query(['ethAddressModifiable'], email);
            modifiable = modifiable[0] && modifiable[0].ethaddressmodifiable || false;
            this.response(200, { modifiable });
        }


        // Confirm btc address modifiable or not
        async btcModifiable() {
            const email = this.getEmail();
            let modifiable = await this.service.users.query(['btcAddressModifiable'], email);
            modifiable = modifiable[0] && modifiable[0].btcaddressmodifiable || false;
            this.response(200, { modifiable });
        }
    }

    return User;
}