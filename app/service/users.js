const Table = Symbol('Users#table');

module.exports = app => {

    const Base = require('./base')(app);

    class Users extends Base {

        // Structure of table users
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    email: undefined,
                    password: undefined,
                    firstName: undefined,
                    lastName: undefined,
                    address: undefined,
                    sspj: undefined,
                    ethAddress: undefined,
                    token: undefined,
                    auth: undefined,
                    createAt: undefined
                };
            }

            return this[Table];
        }


        // Judge user exists or not
        async exists(email) {

            // parameter email doesn't exist
            if (!this._parameterExists(email)) {
                return false;
            }

            try {
                // user exists
                if (await this._count('users', 'email', { email }) === 1) {
                    return true;
                }

                // user doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Judge token exists or not(also can judge user exists or not)
        async tokenExists(token) {

            // parameter token doesn't exist
            if (!this._parameterExists(token)) {
                return false;
            }

            try {
                // token exists
                if (await this._count('users', 'email', { token }) === 1) {
                    return true;
                }

                // token doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Insert a user info record to table users
        async insert(user) {

            // format user attributes to table structure
            user = this._formatTableValue(this.table, user);
            user.createAt = Date.parse(new Date());
            
            // email or password doesn't exist
            if (!user.email || !user.password) {
                return false;
            }

            // user exists
            if (await this.exists(email)) {
                return false;
            }

            // insert a user into table users
            try {
                await this._insert('users', user);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Update user's info specified by user email
        async update(user, wheres) {

            // format user's attributes and wheres' attribute to table structure
            user = this._formatTableValue(this.table, user);
            user.auth = true;
            wheres = this._formatTableValue(this.table, user);

            // do not specified user
            if (!user.email) {
                return false;
            }

            // update user's info
            try {
                await this._update('users', user, wheres);
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }

    }

    return Users;
}