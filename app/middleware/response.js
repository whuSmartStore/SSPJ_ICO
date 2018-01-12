

module.exports = options => {

    return async (ctx, next) => {
        
        ctx.set('Cache-Control', 'no-cache');

        console.log(ctx.request.url);

        await next();
    }
}