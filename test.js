// 'use strict';
// const nodemailer = require('nodemailer');

// // Generate test SMTP service account from ethereal.email
// // Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {

//     const transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         auth: {
//             user: 'pj5q43uwrj5yowtr@ethereal.email',
//             pass: 'zBxhxsEyk8C9CDfyXx'
//         }
//     });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Fred Foo 👻" <pj5q43uwrj5yowtr@ethereal.email>', // sender address
//         to: '1942750262xj@gmail.com, 1942750262@qq.com', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>' // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//     });
// });


var nodemailer = require('nodemailer');  
var transporter = nodemailer.createTransport({  
  service: 'smtp.qq.com"',  
  auth: {  
    user: '527828938@qq.com',  
    pass: 'ugxovfwhvxxxxxx' //授权码,通过QQ获取  
  
  }  
  });  
  var mailOptions = {  
    from: '527828938@qq.com', // 发送者  
    to: '1942750262@qq.com', // 接受者,可以同时发送多个,以逗号隔开  
    subject: 'nodemailer2.5.0邮件发送', // 标题  
    //text: 'Hello world', // 文本  
    html: `<h2>nodemailer基本使用:</h2><h3>  
    <a href="http://blog.csdn.net/zzwwjjdj1/article/details/51878392">  
    http://blog.csdn.net/zzwwjjdj1/article/details/51878392</a></h3>`   
  };  
  
  transporter.sendMail(mailOptions, function (err, info) {  
    if (err) {  
      console.log(err);  
      return;  
    }  
  
    console.log('发送成功');  
  });