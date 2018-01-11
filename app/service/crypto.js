const crypto = require('crypto');

module.exports = app => {

    class Crypto extends app.Service {

        encrypto(text) {
            const cipher = crypto.createCipher('aes192', this.app.config.keys);
            return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        }

        decrypto(sectext) {
            const decipher = crypto.createDecipher('aes192', this.app.config.keys);
            return decipher.update(sectext, 'hex', 'utf8') + decipher.final('utf8');
        }

        generateToken(email) {
            const cipher = crypto.createCipher('aes192', email);
            return cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
        }
    }

    return Crypto;
}