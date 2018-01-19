

module.exports = app => {

    const Base = require('./base')(app);

    class Followers extends Base {

        // Index test
        async index() {
            this.response(200, 'index test successed');
        }


        // Get some investor's followers
        async myFollowers() {

            let email = this.getEmail();
            const emails = await this.service.followers.getMyFollowers(email);

            const followers = [];
            for (email of emails) {
                
                // Get every follower's info
                const follower = await this.service.users.query(['createAt', 'firstName', 'lastName', 'sspj', 'invested'], { email });
                if (follower !== '{}') {
                    follower.bonus = follower.invested * 0.05;
                    followers.push(follower);
                }
            }

            this.response(200, followers);
        }


        // Get some investor's referal link
        async myReferralLink() {
            const email = this.getEmail();
            const token = await this.service.users.query(['token'], { email });

            // Get token failed
            if (!token.token) {
                this.response(400, 'Get my referral link failed');
                return;
            }

            // Get investor's token
            const myReferralLink = `http://${this.config.dns.host}:${this.config.dns.port}/?ref_id=${token.token}`;
            this.response(200, { myReferralLink });
        }

    }

    return Followers;
}