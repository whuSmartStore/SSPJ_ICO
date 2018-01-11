


module.exports = app => {

    const Base = require('./base')(app);

    class Bills extends Base {

        // Index test
        async index() {
            this.response(200, 'index test successed');
        }


        // Get the transaction info of someone specified by email
        async getTransactionInfo() {
            const email = this.getEmail();
            const bills = await this.service.users.query(['*'], { email });
            this.response(200, bills);
        }
    }

    return Bills;
}