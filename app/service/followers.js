const Table = Symbol('Followers#table');

module.exports = app => {

    const Base = require('./base')(app);
    const Users = require('./users')(app);

    class Followers extends Base {

        // Structure of table followers
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    token: undefined,
                    email: undefined
                };
            }

            return this[Table];
        }


        // Judge follower record exists or not
        async exists(token, email) {

            // token or email parameter doesn't exist 
            if (!this._parameterExists(token) || !this._parameterExists(email)) {
                return false;
            }

            try {
                // follower record exists
                if (await this._count('followers', 'id', { token, email }) === 1) {
                    return true;
                }

                // follower record doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Insert a follower record to table followers
        async insert(follower) {

            // just reserve table followers' attributes
            follower = this._formatTableValue(this.table, follower);

            // token or email doesn't exist
            if (!follower.token || !follower.email) {
                return false;
            }

            // user doesn't register
            const users = new Users();
            if (!users.exists(follower.email)) {
                return false;
            }

            // token doesn't exist in table users
            if(!users.tokenExists(follower.token)) {
                return false;
            }

            // follower record exists
            if (await this.exists(follower.token, email)) {
                return false;
            }

            // insert follower record to table followers
            try {
                await this._insert('followers', follower);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Get some investor's followers
        async getMyFollowers(email) {
            const users = new Users();
            const token = await users.query(['token'], { email }).token;

            // can not get investor's dtoken
            if (!token) {
                return [];
            }

            // Get investor's follower email array
            try {
                const followers = await this._query('followers', ['email'], { token });
                const follarr = [];
                followers.map(follower => {
                    follarr.push(follower.email);
                });
                return follarr;
            } catch (err) {
                this.logger.error(err);
                return [];
            }
        }
    }

    return Followers;
}