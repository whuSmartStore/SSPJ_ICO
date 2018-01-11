

module.exports = options => {

    return async (ctx, next) => {
        
        ctx.set('Cache-Control', 'no-cache');

        await next();
    }
}