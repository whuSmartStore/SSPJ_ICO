

module.exports = options => {

    return async (ctx, next) => {
        
        console.log(ctx);

        await next();
        
        ctx.set('Cache-Control', 'no-cache');
    }
}