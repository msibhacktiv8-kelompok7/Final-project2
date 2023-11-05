const { Op } = require("sequelize");
const { User } = require("../models");
const { deleteKey, generateToken, hashPassword, comparePassword } = require("../utils");

class UserController {
    static async createUser(req, res) {
        try {
            const dataUser = req.body;
            dataUser.password = hashPassword(dataUser.password);
            const user = await User.create(dataUser);
            return res.status(200).json({
                User: deleteKey('password', user.dataValues)
            });
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internal Servel Error" });
        }

    }

    static async login(req, res) {
        try {
            // ambil email dan pasword yang suer masukkan
            const { email, password } = req.body;
            // cek email dan user notnull
            // cari data user ke database
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            // cek apakah data user berhasil ditemukan atau tidak
            if (user === null) {
                throw {
                    code: 400,
                    message: "User not found"
                };
            }
            // cek apakah passowrd user sama dengan didatabse
            const isValid = comparePassword(password, user.password);
            if (!isValid) {
                throw {
                    code: 400,
                    message: "Email or Passowrd Worng!"
                };
            }
            
            // hapus key password 
            const payload = deleteKey('password', user.dataValues);
            // generate token
            const token = generateToken(payload);
            // add token to header
            return res.status(200).json({ token: token });
        } catch (err) {
            if (err.code) {
                return res.status(err.code).json({
                    message: err.message
                });
            }
            console.log(err.message);
            return res.status(500).json({ message: "Internar server error" });
        }

    }
}


module.exports = UserController;