

module.exports = ctx => {

    class Base {

        // Set email to cookie
        setEmail(email) {
            ctx.cookies.set('username', email, {
                maxAge: 1000 * 60 * 60 * 24 * 3,
                expires: 1000 * 60 * 60 * 24 * 3,
                path: '/',
                signed: true,
                encrypt: false
            });
        }


        // Set password to cookie
        setPassword(password) {
            ctx.cookies.set('password', password, {
                maxAge: 1000 * 60 * 60 * 3,
                expires: 1000 * 60 * 60 * 3,
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
            return ctx.cookies.get('username', {
                signed: true,
                encrypt: false
            });
        }


        // Get password from cookie
        getPassword() {
            return ctx.cookies.get('password', {
                singed: true,
                encrypt: true
            });
        }


        // Judge email and password setted or not
        async cookiesSetted() {

            // email and password setted
            const email = this.getEmail();
            const password = this.getPassword();
            if (email && password && (password === await ctx.service.users.getPasswd(email))) {
                return true;
            }

            // email or password doesn't setted
            return false;
        } 
    }

    return Base;
}