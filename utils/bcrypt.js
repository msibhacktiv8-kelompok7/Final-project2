const bcrypt = require("bcryptjs");

/**
 * 
 * @param {string} pass - password yang diinputkan oleh user
 * @returns {string} hasil hashing menggunakan bcrypt 
 */
function hashPassword(pass) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
}

/**
 * 
 * @param {string} pass - password yang diinputkan oleh user 
 * @param {string} passHashed - hasil hash passwrod yang sudah kita simpan di database
 * @returns {boolean} - hasil compare pssowrd yang diinput oleh user dngan pasword yang ada di databse
 * 
 */
function comparePassword(pass, passHashed) {
    return bcrypt.compareSync(pass, passHashed);
}


module.exports = {hashPassword, comparePassword}