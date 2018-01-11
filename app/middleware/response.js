

module.exports = options => {

    return async (ctx, next) => {

        await next();
        
        ctx.set('Cache-Control', 'no-cache');
    }
}