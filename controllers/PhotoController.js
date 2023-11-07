const {Photo, User} = require("../models");

class PhotoController {
    // post photo
    static async postPhoto(req, res) {
        try {
            // check data user
            const user = req.user;
            // ambil data yang dikirikan klien
            const photo = req.body;
            photo.UserId = user.id;
            // simpan data kedalam database
            const savePhoto = await Photo.create(photo);
            res.status(200).json(savePhoto);
            // tmapilkan response
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internal Servel Error" });
        }
    }
    // get photo
    // Update photo
    // Delete photo
}

module.exports = PhotoController;