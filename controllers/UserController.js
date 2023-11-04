const { User } = require("../models");

class UserController {
    static async createUser(req, res) {
        try {
            const dataUser = req.body;
            const newUser = await User.create(dataUser);
            delete newUser.password;
            return res.status(200).json(newUser);
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internal Servel Error" });
        }

    }
}


module.exports = UserController;