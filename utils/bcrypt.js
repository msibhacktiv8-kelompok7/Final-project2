const bcrypt = require("bcryptjs");
require("dotenv").config()
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY

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

const createToken = (payload) => {
    const token = jwt.sign(payload, SECRET_KEY)
    return token
}

const verifyToken = (token) => {
    const decoded = jwt.verify(token, SECRET_KEY)
    return decoded
}



module.exports = { hashPassword, comparePassword, createToken, verifyToken }