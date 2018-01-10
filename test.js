const crypto = require('crypto');

const secret = crypto.createHmac('sha256', 'test').digest('hex');
console.log(secret);