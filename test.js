

const nodemailer = require('nodemailer');

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
  from: 'sspj_ico team <1942750262@qq.com>',
  to: 'sincerely investor <2794918382@qq.com>',
  subject: '',
  text: '',
  html: '', 
}

transporter.sendMail(emailOptions, function(err, info) {
  if (err) {
    console.log(err);
  }
  console.log('email send successed');
  transporter.close();
})