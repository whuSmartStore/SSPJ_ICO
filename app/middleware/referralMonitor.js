

module.exports = options => {
    
    return async (ctx, next) => {

        const Base = require('./base')(ctx);
        const base = new Base();

        // Check if ref_id exists or not when investor request '/'
        if (ctx.query.ref_id && await ctx.service.users.tokenExists(ctx.query.ref_id)) {
            base.setToken(ctx.query.ref_id);
        }

        await next();
    }
}