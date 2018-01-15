

module.exports = options => {
    
    return async (ctx, next) => {

        const Base = require('./base')(ctx);
        const base = new Base();

        // Check if ref_id exists or not when investor request '/'
        const ref_id = ctx.query.ref_id;
        if (ref_id && await ctx.service.users.tokenExists(ref_id)) {
            base.setToken(ref_id);
        }

        await next();
    }
}