const Table = Symbol('Followers#table');

module.exports = app => {

    const Base = require('./base')(app);

    class Followers extends Base {

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


        async exists(token, email) {

            if (!this._parameterExists(token) || !this._parameterExists(email)) {
                return false;
            }

            try {
                if (await this._count('followers', 'id', { token, email }) === 1) {
                    return true;
                }

                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        async insert(follower) {

            if (!follower.token || !follower.email) {
                return false;
            }

            if ()
        }
    }

    return Followers;
}