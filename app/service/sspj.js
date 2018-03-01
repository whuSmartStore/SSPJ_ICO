const Table = Symbol('SSPJ#table');

module.exports = app => {

    const Base = require('./base')(app);

    class SSPJ extends Base {

        // Constructure of table sspj
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    type: undefined,
                    amount: undefined,
                    rate: undefined,
                    remain: undefined
                };
            }

            return this[Table];
        }


        // Judge sspj record exists or not
        async exists(type) {

            // parameter type doesn't exist
            if (!this._parameterExists(type)) {
                return false;
            }

            try {
                // sspj record exists
                if (await this._count('sspj', 'id', { type }) === 1) {
                    return true;
                }

                // sspj record doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Update sspj record info
        async update(sspj, wheres) {

            // format sspj's attributes to table sspj
            sspj = this._formatTableValue(this.table, sspj);
            wheres = this._formatTableValue(this.table, wheres);

            // wheres's type doesn't exist
            if (!wheres.type) {
                return false;
            }

            // sspj record doesn't exist
            if (!await this.exists(wheres.type)) {
                return false;
            }

            // update sspj record's info
            try {
                await this._update('sspj', sspj, wheres);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Get some sspj specified by type remain amount
        async getLeft(type) {

            try {
                const sspj = await this._query('sspj', ['remain'], { type });
                return sspj[0] && +sspj[0].remain || 0;
            } catch (err) {
                this.logger.error(err);
                return 0;
            }
        }


        // Subtract the amount of some sspj specified by type with some number
        async sub(amount, type) {
            
            let left = await this.getLeft(type);

            // sspjs left amount is inadequate
            if (left < amount) {
                return false;
            }

            try {
                left -= amount;
                if (!await this.update({ remain: left }, { type })) {
                    return false;
                }

                return true;
            } catch (err) {
                this.logger.error('update sspj left amount failed');
                return false;
            }
        }


        // Get the bonuses rate according to the datatime
        getBonusRate(timestamp) {
            
            const len = this.config.bonuses.length;

            for (let i = 0; i < len - 2; i++) {
                if (timestamp < this.config.bonuses[i + 1].time) {
                    return this.config.bonuses[i].bonus;
                }
            }

            if (timestamp >= this.config.bonuses[len -1].time) {
                return this.config.bonuses[len - 1].bonus;
            }
        }


        // Get the index of stage according to time
        getStage(timestamp) {
    
            const len = this.config.bonuses.length;

            for(let i = 0; i < len - 1; i++) {
                if (timestamp < this.config.bonuses[i].time) {
                    return i;
                }
            }

            if (timestamp >= this.config.bonuses[i]) {
                return len;
            }
        }


        async task(transactions, type) {

            for (const transaction of transactions) {

                /* bills table */
                // Transacion exists in app.cache
                if (this.app.ethTXHash[transaction.hash]) {
                    continue;
                }

                let email;
                if (type === 'ETH') {
                    // Judge email exists or not
                    email = await this.service.users.query(['email'], { ethAddress: transaction.from });
                } else {
                    email = await this.service.users.query(['email'], { btcAddress: transaction.from });
                }
                    email = email[0] && email[0].email || undefined;
                if (!email) {
                    continue;
                }

                const trans = {};
                trans.email = email;
                trans.paid = (type === 'ETH') ? transaction.value / 1000000000000000000 || 0 :
                    transaction.value / 100000000 || 0; 
                trans.payType = type;
                const paid = trans.paid * this.config.icoInfo.salePrice[1] * 
                    (1 + this.getBonusRate(Date.parse(new Date())));
                trans.sspj = (type === 'ETH') ? paid : paid * await this.service.icoInfo.btcEthRate();
                trans.TXHash = transaction.hash;
                trans.createAt = transaction.timeStamp * 1000;
                trans.block = transaction.blockNumber;
                
                // Transaction exists in table bills
                if (await this.service.bills.exists(trans.TXHash)) {
                    this.logger.info(`${trans.TXHash} exists in table bills`);
                    continue;
                }

                // Transaction does not exit in table bills
                if (!await this.service.bills.insert(trans)) {
                    this.logger.error(`${trans.TXHash} record log failed`);
                }

                // Tranaction does not exists in table bills and set it to the cache
                this.app.ethTXHash[transaction.hash] = true;

                
                /* users table invested */
                // update investor's invested and sspj
                const user = {};
                let invested = await this.service.users.query(['invested'], { email });
                let sspj = await this.service.users.query(['sspj'], { email });
                invested = +invested.invested || 0;
                sspj = +sspj.sspj || 0;
                invested += trans.sspj;
                sspj += trans.sspj;
                user.invested = invested;
                user.sspj = sspj;
                if (type === 'ETH') {
                    user.ethAddressModifiable = false;
                } else {
                    user.btcAddressModifiable = false;
                }
                if (!await this.service.users.update(user, { email })) {
                    this.logger.error(`${email}'s invested and sspj update failed`);
                }


                /* table sspj */
                // modify investor amount info
                await this.sub(trans.sspj, 'investor');
                await this.sub(trans.sspj * 0.05, 'bonuses');

                // modify investor stage amount info according to time
                const stage = this.getStage(Date.parse(new Date()));
                if (!stage) {
                    await this.sub(trans.sspj, `investor_${stage}`);
                }


                /* users table bonus */
                const referral = await this.service.followers.getIntroducer(email);

                // investor doesn't have introducer
                if (!referral) {
                    continue;
                }

                // update investor's indroducer's bonus and sspj
                let bonus = await this.service.users.query(['bonus'], { email: referral });
                bonus = +bonus.bonus || 0; 
                sspj = await this.service.users.query(['sspj'], { email: referral });
                sspj = +sspj.sspj || 0;               
                bonus += +trans.sspj * 0.05;
                sspj += trans.sspj * 0.05;
                if (!await this.service.users.update({ bonus, sspj }, { email: referral })) {
                    this.logger.error(`${referral}'s bonus and sspj update failed`);
                }
            }
        }


        // Schedule task of eth
        async ethTask() {
            let url = `https://api.etherscan.io/api?module=account&action=txlist&`;
            url += `address=${this.config.address.eth}&`;
            url += `startblock=0&`;
            url += `endblock=99999999&`;
            url += `sort=asc&`;
            url += `apikey=${this.config.token.eth}`;
            
            const response = await this.ctx.curl(url, {
                dataType: 'json',
                timeout: 500000
            });
            
            const transactions = response.data.result;
            
            if (!transactions) {
                this.logger.error('request eth transaction failed');
                return;
            }

            await this.task(transactions, 'ETH');
        }
    }

    return SSPJ;
}