const crypto = require('crypto');

const secret = 'xxx';
const str = 'test';

const secstr = crypto.createHmac('sha256', secret).update(str).digest('hex');
console.log(secstr);

const desecstr = crypto.createCipher('sha256', secret).update(secstr, 'hex', 'utf-8');
console.log(desecstr);