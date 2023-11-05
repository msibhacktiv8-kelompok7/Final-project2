const jwt = require('jsonwebtoken')
/**
 * secret key untuk token yang akan kita buat
 */
const SECRET_KEY = process.env.SECRET_KEY|| 'rahasia';


/**
 * 
 * @param {object} payload - data yang nantinya akan kita simpan didalam token
 * @returns {string} - token yang menyimpan data
 */
function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY);
}

/**
 * @param {string} token - token hasil generate yang menyimpan data
 * @returns {object} - data yang kita simpan didalam token
 */
function veriifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}


module.exports = {generateToken, veriifyToken}