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
                    invested: undefined,
                    bonus: undefined,
                    sspj: undefined,
                    ethAddress: undefined,
                    ethAddressModifiable: undefined,
                    btcAddress: undefined,
                    btcAddressModifiable: undefined,
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


        // Query user's info
        async query(attributes, wheres) {

            // format attributes and wheres' attributes to table users
            attributes = this._formatQueryAttributes(this.table, attributes);
            wheres = this._formatTableValue(this.table, wheres);

            // query condition includes unique identifier
            if (wheres.email || wheres.token) {
                try {
                    const user = await this._query('users', attributes, wheres);
                    return user[0] || {};
                } catch (err) {
                    this.logger.error(err);
                    return {};
                }
            }

            // query condition doesn't includes unique identifier
            try {
                const users = await this._query('users', attributes, wheres);
                return users;
            } catch (err) {
                this.logger.error(err);
                return [];
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
            if (await this.exists(user.email)) {
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
            wheres = this._formatTableValue(this.table, wheres);

            // do not specified user
            if (!wheres.email) {
                return false;
            }

            // user doesn't exist in table users
            if (!await this.exists(wheres.email)) {
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


        // Get user's password through user's email
        async getPasswd(email) {

            try {
                const passwd = await this._query('users', ['password'], { email });
                return passwd[0] && passwd[0].password;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }

    }

    return Users;
}