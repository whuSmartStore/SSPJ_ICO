

module.exports = options => {

    return async (ctx, next) => {

        const Base = require('./base')(ctx);
        const base = new Base();
        const email = base.getEmail();
        const password = base.getPassword();

        if (!email || !password || (password !== await ctx.service.users.getPasswd(email))) {
            ctx.redirect('/public/login.html');
            return;
        }

        await next();
    }
}