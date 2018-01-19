

module.exports = app => {

    return {
        schedule: {
            interval: '5m',
            type: 'all',
            immediate: true,
            disable: false
        },

        async task(ctx) {
            await ctx.service.sspj.ethTask();
        }
    }
}