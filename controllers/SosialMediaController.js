const { User, SosialMedia } = require("../models");


class SosialMediaController {
    // post sosmed
    static async postSosialMedia(req, res) {
        try {
            // check data user
            const user = req.user;
            // ambil data yang dikirikan klien
            const sosmed = req.body;
            sosmed.UserId = user.id


            // simpan data kedalam database
            const saveSosmed = await SosialMedia.create(sosmed);
            res.status(200).json(saveSosmed);
            // tmapilkan response
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            } else if (err.name === "SequelizeForeignKeyConstraintError") {
                console.log(err.message);
                return res.status(400).json({ message: "User id anda tidak ditemukan" });
            }
            console.log(err.name);
            return res.status(500).json({ message: "Internal Servel Error" });
        }
    }
    // get sosmed
    static async getSosialMedia(req, res) {
        try {
            const user = req.user;
            const getSosmed = await SosialMedia.findAll({
                include: [{
                    model: User,
                    attributes: [
                        'id',
                        'username',
                        'profile_image_url'
                    ]
                },],


            });
            res.status(200).json((getSosmed));
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internal Servel Error" });
        }
    }
    // Update comment
    static async updateSosialMedia(req, res) {
        try {
            const user = req.user;
            const socialMediaId = req.params.socialMediaId;
            const newSosmed = req.body;
            const currentDate = new Date();

            if (JSON.stringify(newSosmed) === "{}") {
                return res.status(400).json({
                    message: "Data yang anda masukkan kosong"
                });
            }

            const oldSosmed = await SosialMedia.findOne({
                where: {
                    id: socialMediaId,
                    UserId: user.id
                }
            });

            if (oldSosmed === null) {
                return res.status(400).json({
                    message: "Sosial Media Tidak ditemukan"
                });
            }


            const sosmedUpdate = await SosialMedia.update(
                {
                    name: newSosmed.name || newSosmed.name,
                    sosial_media_url: newSosmed.sosial_media_url || newSosmed.sosial_media_url,
                    updatedAt: currentDate
                }, {
                where: {
                    id: socialMediaId
                },
                returning: true
            }
            );

            return res.status(200).json({
                sosialmedia: sosmedUpdate[1][0]
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json("error");
        }
    }
    // // Delete comment
    static async deleteSosmed(req, res) {
        try {
            const user = req.user;
            const socialMediaId = req.params.socialMediaId;
            const sosmedInDb = await SosialMedia.findOne({
                where: {
                    id: socialMediaId,
                    UserId: user.id
                }
            });

            if (sosmedInDb === null) {
                return res.status(400).json({
                    message: "Sosial Media Tidak ditemukan"
                });
            }


            if (user.id !== sosmedInDb.UserId) {
                throw {
                    code: 401,
                    message: 'Anda tidak bisa menghapus comment ini'
                };
            }

            const deleteSosmed = await SosialMedia.destroy({
                where: {
                    id: socialMediaId
                },
                returning: true
            });

            if (deleteSosmed === 0) {
                throw {
                    code: 400,
                    message: "Gagal Hapus Comment"
                };
            }
            return res.status(200).json({
                message: "Your Social Media has been successfully deleted"
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

module.exports = SosialMediaController;

