

module.exports = app => {

    return {
        schedule: {
            interval: '10s',
            type: 'all',
            immediate: true,
            disable: false
        },

        async task(ctx) {
            console.log('1');
            await ctx.service.sspj.ethTask();
        }
    }
}