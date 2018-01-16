

module.exports = app => {

    return {
        schedule: {
            interval: '10s',
            type: 'all',
            immediate: true,
            disable: false
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
                if (ctx.app.ethTXHash[transaction.hash]) {
                    continue;
                }

                // Judge email exists or not
                let email = await ctx.service.users.query(['email'], { ethAddress: transaction.from });
                email = email[0] && email[0].email || undefined;
                if (!email) {
                    continue;
                }

                const ethTransaction = {};
                ethTransaction.email = email;
                ethTransaction.paid = transaction.value / 1000000000000000000 || 0;
                ethTransaction.payType = 'ETH';
                ethTransaction.sspj = ethTransaction.paid * ctx.app.config.icoInfo.salePrice[1] * 
                    (1 + ctx.service.sspj.getBonusRate(Date.parse(new Date())));
                ethTransaction.TXHash = transaction.hash;
                ethTransaction.createAt = Date.parse(new Date());
                ethTransaction.block = transaction.blockNumber;
                
                // Transaction exists in table bills
                if (await ctx.service.bills.exists(ethTransaction.TXHash)) {
                    ctx.logger.info(`${ethTransaction.TXHash} exists in table bills`);
                    continue;
                }

                // Transaction does not exit in table bills
                if (!await ctx.service.bills.insert(ethTransaction)) {
                    ctx.logger.error(`${ethTransaction.TXHash} record log failed`);
                }

                // Tranaction does not exists in table bills and set it to the cache
                ctx.app.ethTXHash[transaction.hash] = true;

                
                /* users table invested */
                // update investor's invested and sspj
                let invested = await ctx.service.users.query(['invested'], { email });
                let sspj = await ctx.service.users.query(['sspj'], { email });
                invested = +invested.invested || 0;
                sspj = +sspj.sspj || 0;
                invested += ethTransaction.sspj;
                sspj += ethTransaction.sspj;
                if (!await ctx.service.users.update({ invested, sspj }, { email })) {
                    ctx.logger.error(`${email}'s invested and sspj update failed`);
                }


                /* table sspj */
                await ctx.service.sspj.sub(ethTransaction.sspj, 'investor');
                await ctx.service.sspj.sub(ethTransaction.sspj * 0.05, 'bonuses');


                /* users table bonus */
                const referral = await ctx.service.followers.getIntroducer(email);

                // investor doesn't have introducer
                if (!referral) {
                    continue;
                }

                // update investor's indroducer's bonus and sspj
                let bonus = await ctx.service.users.query(['bonus'], { email: referral });
                bonus = +bonus.bonus || 0; 
                sspj = await ctx.service.users.query(['sspj'], { email: referral });
                sspj = sspj.sspj || 0;               
                bonus += ethTransaction.paid * 0.05;
                sspj += ethTransaction.paid * 0.05;
                if (!await ctx.service.users.update({ bonus, sspj }, { email: referral })) {
                    ctx.logger.error(`${referral}'s bonus and sspj update failed`);
                }
            }
        }
    }
}