const nodemailer = require('nodemailer');

module.exports = app => {

    const Base = require('./base')(app);

    class Email extends Base {
        
        // Send email
        async _send(transporter, emailOptions) {
            return new Promise((resolve, reject) => {
                transporter.sendMail(emailOptions, (err, info) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(info);
                });
            }).then(info => {
                return {
                    send: true,
                    info
                };
            }).catch(err => {
                return {
                    send: false,
                    err
                }
            });
        }
        

        async send(investor, page) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.qq.com',
                secureConnection: true,
                port: 465,
                auth: {
                    user: '1942750262@qq.com',
                    pass: 'yykhngwjmmexbgci'
                }
            });

            const emailOptions = {
                from: `SSPJ ICO TEAM <1942750262@qq.com>`,
                to: `Sincerely Investor <${investor}>`,
                subject: 'Active Account',
                html: page,
            }

            const result = await this._send(transporter, emailOptions);
            if (result.send) {
                return 'email send successed!';
            }

            this.logger.error(result.err);
            return 'email send failed!'
        }


        // Active account link email
        async activeAccount(investor, url) {
            const page = `<a href="${url}">active account</a>`;
            return await this.send(investor, page);
        }

        // Reset password link email
        async resetPassword(investor, url) {
            const page = `<a href="${url}">reset password</a>`;
            return await this.send(investor, page);
        }
    }

    return Email;
}