const crypto = require('crypto');
const validator = require('validator');

module.exports = app => {

    const Base = require('./base')(app);

    class User extends Base {

        // Index test
        async index() {
            const str = 'select * from wallets';
            const wallets = await this.app.db.query(str, []);
            this.response(200, wallets);
        }


        // Judge some user exists or not(used to judge before register)
        async exists() {

            const email = this.ctx.params.username;
            const exists = await this.service.users.exists(email);
            this.response(200, { exists });
        }


        // Register a new user
        async register() {

            const user = this.ctx.request.body;
            console.log(user);

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

            // set username to cookie
            this.ctx.cookies.set('username', user.email, {
                maxAge: 1000 * 60 * 60 * 24 * 3,
                expires: 1000 * 60 * 60 * 24 * 3,
                path: '/',
                signed: true,
                encrypt: false
            });

            // set password to cookie
            this.ctx.cookies.set('password', user.password, {
                maxAge: 1000 * 60 * 60 * 3,
                expires: 1000 * 60 * 60 * 3,
                path:'/',
                signed: true,
                encrypt: true
            });

            this.ctx.redirect('/public/ico/dashbord.html');
        }

         
        // User logIn through default way
        async signIn() {
            
            // redirect to ico dashbord directly when cookie record exists
            const username = this.ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });

            let password = this.ctx.cookies.get('password', {
                singed: true,
                encrypt: true
            });

            if (username && password && (password === this.service.users.getPasswd(username))) {
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

            const secret = crypto.createHmac('sha256', user.password).digest('hex')
            password = await this.service.users.getPasswd(user.email);
            if (password !== false && secret === password) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }
            
            this.response(403, 'password error');
        }


        // User logIn through google
        async signInGoogle() {
            
            // redirect to ico dashbord directly when cookie record exists
            const username = this.ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });

            let password = this.ctx.cookies.get('password', {
                signed: true,
                encrypt: true
            });

            if (username && password && (password === this.service.users.getPasswd(username))) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }

            // user logIn with google account
            this.response(200, 'waited to complete');
        }


        // User logIn through facebook
        async signInFacebook() {

            // redirect to ico dashbord directly when cookie record exists
            const username = this.ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });

            let password = this.ctx.cookies.get('password', {
                signed: true,
                encrypt: false
            });

            if (username && password && (password === this.service.users.getPasswd(username))) {
                this.ctx.redirect('/public/ico/dashbord.html');
                return;
            }

            // user logIn with google account
            this.response(200, 'waited to complete');
        }
    }

    return User;
}