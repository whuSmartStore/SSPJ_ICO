

module.exports = app => {

    return {
        schedule: {
            interval: '0.5s',
            type: 'all',
            immediate: true,
            disable: false
        },

        async task(ctx) {
            await ctx.service.sspj.ethTask();
        }
    }
}