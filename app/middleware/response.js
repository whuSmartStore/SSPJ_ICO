

module.exports = options => {

    return async (ctx, next) => {
        console.log(ctx.request.url);
        await next();

        ctx.set('Cache-Control', 'no-cache');
    }
}