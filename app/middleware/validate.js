

module.exports = options => {

    return async (ctx, next) => {

        const username = ctx.cookies.get('username', {
            signed: true,
            encrypt: false
        });

        let password = ctx.cookies.get('password', {
            signed: true,
            encrypt: true
        });

        if (username || password || (password !== await ctx.service.users.getPasswd(username))) {
            ctx.redirect('/public/register.html');
            return;
        }

        await next();
    }
}