

module.exports = app => {

    class Base extends app.Controller {

        response(code ,message) {
            if (+code > 399) {
                this.ctx.body = {
                    code,
                    message
                };
                return;
            }

            if (typeof message === 'string') {
                this.ctx.body = {
                    code,
                    data: {
                        info: message
                    }
                };
                return;
            }

            this.ctx.body = {
                code,
                data: message
            }
        }
    }

    return Base;
}