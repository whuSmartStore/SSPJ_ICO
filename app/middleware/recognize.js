

module.exports = options => {

    return async (ctx, next) => {

        const Base = require('./base')(ctx);
        const base = new Base();        
        if (await base.cookiesSetted()) {
            ctx.redirect('/public/ico/dashbord.html');
            return;    
        }

        await next();
    }
}