const { User, Photo } = require("../models");
const { deleteKey, generateToken, hashPassword, comparePassword } = require("../utils");



class UserController {
    // register user
    static async register(req, res) {
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
    // login user
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
            // console.log(user);
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
    // update user
    static async update(req, res) {
        try {
            const user = req.user;
            const userId = req.params.userId;
            const newUser = req.body;
            if (newUser.password) {
                newUser.password = hashPassword(newUser.password);
            }

            // console.log(user.id, userId);

            if (user.id != userId) {
                throw {
                    code: 401,
                    message: 'Anda tidak boleh mengubah User ini'
                };
            }

            const userUpdated = await User.update({
                email: newUser.email || user.email,
                full_name: newUser.full_name || user.full_name,
                username: newUser.username || user.username,
                password: newUser.password || user.password,
                profile_image_url: newUser.profile_image_url || user.profile_image_url,
                age: newUser.age || user.age,
                phone_number: newUser.phone_number || user.phone_number
            }, {
                where: {
                    id: userId
                },
            });


            if (userUpdated == 0) {
                throw {
                    code: 401,
                    message: 'User tidak ditemukan'
                };
            }
            
            let userCurrent = await User.findOne({
                where: {
                    id: userId
                },
                attributes: {
                    exclude: ["password"]
                }
            })

            return res.status(200).json({
                user: userCurrent
            });
        } catch (err) {
            if (err.code) {
                return res.status(err.code).json({ message: err.message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internar server error" });
        }


    }

    static async delete(req, res) {
        try {
            const user = req.user;
            const userId = req.params.userId;
            // check apakah user yagn sekarang sedang login sama dengan param yang di kirim user
            if (user.id != userId) {
                throw {
                    code: 401,
                    message: 'Anda tidak bisa menghapus User ini'
                };
            }

            const deleteUser = await User.destroy({
                where: {
                    id: userId
                },
                returning: true
            });

            if (deleteUser === 0) {
                throw {
                    code: 400,
                    message: "Gagal Hapus user"
                };
            }
            return res.status(200).json({
                message: "Your Account has been successfully deleted"
            });
        } catch (err) {
            if (err.code) {
                return res.status(err.code).json({ message: err.message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internar server error" });
        }


    }
}


module.exports = UserController;