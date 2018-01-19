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

            return await this._send(transporter, emailOptions);
        }


        // Active account link email
        async activeAccount(investor, url) {
            const page = `
                <div style="width: 600px;  height: 400px; padding-top: 200px; background:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1516282646205&di=2da67ffcf23ddae0ce4061d5deb7f594&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Feac4b74543a98226a619951a8182b9014a90eb37.jpg') no-repeat">
                    <a href="${url}" style="font-size: 24px; text-align: center; display: block; color: pink">Active account</a>
                    <span style="text-align: center; font-size: 20px; color: purple; display: inline-block; width: 100%; margin-top: 20px;" >Welcome to join us,click the link to confirm your account</span>
                </div>
            `;
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
