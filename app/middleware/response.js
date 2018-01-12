

module.exports = options => {

    return async (ctx, next) => {
        
        await next();

        console.log(ctx.request.url);
        ctx.set('Cache-Control', 'no-cache');
    }
}