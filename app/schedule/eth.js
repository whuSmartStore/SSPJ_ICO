

module.exports = app => {

    return {
        schedule: {
            interval: '10s',
            type: 'all',
            immediate: true
        },

        async task(ctx) {
            let url = `https://api.etherscan.io/api?module=account&action=txlist&`;
            url += `address=${ctx.app.config.address.eth}&`;
            url += `startblock=0&`;
            url += `endblock=99999999&`;
            url += `sort=asc&`;
            url += `apikey=${ctx.app.config.token.eth}`;
            
            const request = await ctx.curl(url, {
                dataType: 'json',
                timeout: 500000
            });

            const transactions = request.data.result;

            for (const transaction of transactions) {
                
                /* bills table */
                // Transacion exists in app.cache
                if (!ctx.app.ethTXHash[transaction.hash]) {
                    continue;
                }

                // Judge email exists or not
                const email = await ctx.app.service.users.query(['email'], { ethAddress })[0].email;
                console.log(email);
                if (!email) {
                    return;
                }

                const ethTransaction = {};
                ethTransaction.email = email;
                ethTransaction.paid = transaction.value / 1000000000000000000 || 0;
                ethTransaction.type = 'ETH';
                ethTransaction.sspj = ethTransaction.paid / ctx.app.config.icoInfo.salePrice[1];
                ethTransaction.txhash = transaction.hash;
                ethTransaction.createAt = Date.parse(new Date());
                ethTransaction.block = transaction.blockNumber;
                console.log(ethTransaction);
                
                // Transaction exists in table bills
                if (await ctx.app.service.bills.exists(ethTransaction.txhash)) {
                    ctx.app.logger.info(`${ethTransaction.txhash} exists in table bills`);
                    return;
                }

                // Transaction does not exit in table bills
                if (!await ctx.app.service.bills.insert(ethTransaction)) {
                    ctx.app.logger.error(`${ethTransaction.txhash} record log failed`);
                }

                // Tranaction does not exists in table bills and set it to the cache
                ctx.app.ethTXHash[transaction.hash] = true;

                
                /* users table invested */
                let invested = await ctx.app.service.users.query(['invested'], { email }).invested || 0;
                let sspj = await ctx.app.service.users.query(['sspj'], { email }).sspj || 0;
                invested += ethTransaction.sspj;
                sspj += ethTransaction.sspj;
                if (!await ctx.app.service.users.update({ invested, sspj }, { email })) {
                    ctx.app.logger.error(`${email}'s invested and sspj update failed`);
                }

                /* users table bonus */
                const referral = await ctx.app.service.followers.getIntroducer(email);
                if (!email) {
                    return;
                }

                let bonus = await ctx.app.service.users.query(['bonus'], { email: referral }).invested || 0; 
                sspj = await ctx.app.service.users.query(['sspj'], { email: referral }).sspj || 0;
                bonus += ethTransaction.paid * 0.05;
                sspj += ethTransaction.paid * 0.05;


                /* table sspj */

            }
        }
    }
}