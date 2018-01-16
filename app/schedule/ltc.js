

module.exports = app => {
    
    return {

        schedule: {
            interval: '10s',
            type: 'all',
            immediate: true,
            disable: false
        },

        async task(ctx) {
            await ctx.service.sspj.ltcTask();
        }
    }
}