

module.exports = app => {

    class Base extends app.Controller {

        response(code ,message) {
            if (+code > 399) {
                this.ctx.body = {
                    code,
                    message
                };
                return;
            }

            if (typeof message === 'string') {
                this.ctx.body = {
                    code,
                    data: {
                        info: message
                    }
                };
                return;
            }

            this.ctx.body = {
                code,
                data: message
            }
        }


        // Set email to cookie
        setEmail(email) {
            this.ctx.cookies.set('username', email, {
                maxAge: 1000 * 60 * 60,
                expires: 1000 * 60 * 60,
                path: '/',
                signed: true,
                encrypt: false
            });
        }


        // Set password to cookie
        setPassword(password) {
            this.ctx.cookies.set('password', password, {
                maxAge: 1000 * 60 * 60,
                expires: 1000 * 60 * 60,
                path:'/',
                signed: true,
                encrypt: true
            });
        }


        // Set email and password to cookies
        setCookies(email, password) {
            this.setEmail(email);
            this.setPassword(password);
        }


        // Get email from cookie
        getEmail() {
            return this.ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });
        }


        // Get password from cookie
        getPassword() {
            return this.ctx.cookies.get('password', {
                singed: true,
                encrypt: true
            });
        }


        // Judge email and password setted or not
        async cookiesSetted() {

            // email and password setted
            const email = this.getEmail();
            const password = this.getPassword();
            if (email && password && (password === await this.service.users.getPasswd(email))) {
                return true;
            }

            // email or password doesn't setted
            return false;
        }


    }

    return Base;
}