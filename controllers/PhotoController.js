const { Photo, User } = require("../models");


class PhotoController {
    // post photo
    static async postPhoto(req, res) {
        try {
            // check data user
            const user = req.user;
            // ambil data yang dikirikan klien
            const photo = req.body;

            // simpan data kedalam database
            const savePhoto = await Photo.create({
                title: photo.title,
                caption: photo.caption,
                poster_img_url: photo.poster_image_url,
                UserId: user.id
            },{
                include: ["user"]
            }
            );
            res.status(200).json(savePhoto);
            // tmapilkan response
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message  });
            } else if (err.name === "SequelizeForeignKeyConstraintError"){
                console.log(err.message);
                return res.status(400).json({ message: "User id anda tidak ditemukan" });
            }
            console.log(err.name);
            return res.status(500).json({ message: "Internal Servel Error" });
        }
    }
    // get photo
    static async getphoto(req, res) {
        try {
            const user = req.user;
            const getPhoto = await Photo.findAll({
                where: {
                    UserId: user.id
                },
                include: [{
                    model: User,
                    as:"user",
                    attributes: [
                        'id',
                        'username',
                        'profile_image_url'
                    ]
                } ],
                
            });
            res.status(200).json((getPhoto));
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internal Servel Error" });
        }
    }
    // Update photo
    static async updatePhoto(req, res) {
        try {
            const user = req.user;
            const photoId = req.params.photoId;
            const newPhoto = req.body;
            const currentDate = new Date();

            if (JSON.stringify(newPhoto) === "{}") {
                return res.status(400).json({
                    message: "Data yang anda masukkan kosong"
                });
            }

            const oldPhoto = await Photo.findOne({
                where: {
                    id: photoId,
                    UserId: user.id
                }
            });

           if (oldPhoto === null) {
            return res.status(400).json({
                message: "Photo Tidak ditemukan"
            });
           }


            const photoUpdate = await Photo.update(
                {
                    title: newPhoto.title || oldPhoto.title,
                    caption: newPhoto.caption || oldPhoto.caption,
                    poster_image_url: newPhoto.poster_image_url || oldPhoto.poster_image_url,
                    updatedAt: currentDate
                }, {
                where: {
                    id: photoId
                },
                returning: true
            }
            );

            return res.status(200).json({
                Photo: photoUpdate[1][0]
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json("error");
        }
    }
    // Delete photo
    static async daletePhoto(req, res) {
        try {
            const user = req.user;
            console.log(user);
            const photoId = req.params.photoId;
            const photoInDb = await Photo.findOne({
                where: {
                    id: photoId,
                    UserId: user.id
                }
            });

            if (photoInDb === null) {
                return res.status(400).json({
                    message: "Photo Tidak ditemukan"
                });
               }
            

            if (user.id !== photoInDb.UserId) {
                throw {
                    code: 401,
                    message: 'Anda tidak bisa menghapus Photo ini'
                };
            }

            const deletePhoto = await Photo.destroy({
                where: {
                    id: photoId
                },
                returning: true
            });

            if (deletePhoto === 0) {
                throw {
                    code: 400,
                    message: "Gagal Hapus Photo"
                };
            }
            return res.status(200).json({
                message:  "Your Photo has been successfully deleted"
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

module.exports = PhotoController;

