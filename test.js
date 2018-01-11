const crypto = require('crypto');
let email = '1942750262@qq.com';


const cipher = crypto.createCipher('aes192', 'sspj_icosspj_ico_0001');
const token = cipher.update(email, 'utf8', 'hex') + cipher.final('hex');

console.log(token);



const decipher = crypto.createDecipher('aes192', 'sspj_icosspj_ico_0001');
email = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');

console.log(email);