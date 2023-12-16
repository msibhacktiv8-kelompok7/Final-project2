const { Photo, User, Comment } = require("../models");


class PhotoController {
    // post photo
    static async postPhoto(req, res) {
        try {
            // check data user
            const user = req.user;
            // ambil data yang dikirikan klien
            const photo = req.body;
            photo.UserId = user.id


            // simpan data kedalam database
            const savePhoto = await Photo.create(photo);
            res.status(201).json(savePhoto);
            // tmapilkan response
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(401).json({
                    name: err.name,
                    errors: err
                });
            } else if (err.name === "SequelizeForeignKeyConstraintError") {
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
                include: [{
                    model: User,
                    attributes: [
                        'id',
                        'username',
                        'profile_image_url'
                    ]
                }, {

                    model: Comment,
                    attributes: [
                        'comment',
                    ],
                    include: {
                        model: User,
                        attributes: [
                            'username'
                        ]
                    }

                }],


            });
            res.status(200).json({ photos: getPhoto });
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(401).json({ message: err.errors[0].message });
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

            if (!newPhoto.title || newPhoto.title.trim() === "") {
                return res.status(401).json({
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
                return res.status(404).json({
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
                photo: photoUpdate[1][0]
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
                return res.status(404).json({
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
                message: "Your Photo has been successfully deleted"
            });
        } catch (err) {
            return res.status(404).json(err);
        }
    }
}

module.exports = PhotoController;

