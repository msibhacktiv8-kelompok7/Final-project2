const { Photo, User, Comment } = require("../models");


class CommentController {
    // post comment
    static async postComment(req, res) {
        try {
            // check data user
            const user = req.user;
            // ambil data yang dikirikan klien
            const comment = req.body;
            comment.UserId = user.id;

            // simpan data kedalam database
            const saveComment = await Comment.create(comment);
            res.status(201).json({ comments: saveComment });
            // tmapilkan response
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            } else if (err.name === "SequelizeForeignKeyConstraintError") {
                console.log(err.message);
                return res.status(404).json({ message: "User id anda tidak ditemukan" });
            }
            console.log(err.name);
            return res.status(500).json({ message: "Internal Servel Error" });
        }
    }
    // get comment
    static async getComment(req, res) {
        try {
            const user = req.user;
            const getComment = await Comment.findAll({
                include: [{
                    model: Photo,
                    attributes: [
                        "id",
                        "title",
                        "caption",
                        "poster_image_url",
                    ]
                }, {
                    model: User,
                    attributes: [
                        "id",
                        "username",
                        "profile_image_url",
                        "phone_number"
                    ]
                }]
            });
            res.status(200).json(({ comments: getComment }));
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            console.log(err);
            return res.status(500).json({ message: "Internal Servel Error" });
        }
    }
    // Update comment
    static async updateComment(req, res) {
        try {
            const user = req.user;
            const commentId = req.params.commentId;
            const newComment = req.body.comment;
            const currentDate = new Date();

            if (!newComment || newComment.trim() === "") {
                return res.status(401).json({
                    message: "Data yang anda masukkan kosong"
                });
            }

            const oldComment = await Comment.findOne({
                where: {
                    id: commentId,
                    UserId: user.id
                }
            });

            if (oldComment === null) {
                return res.status(404).json({
                    message: "Comment Tidak ditemukan"
                });
            }


            const commentUpdate = await Comment.update(
                {
                    comment: newComment.comment || oldComment.comment,
                    updatedAt: currentDate
                }, {
                where: {
                    id: commentId
                },
                returning: true
            }
            );

            return res.status(201).json({
                comment: commentUpdate[1][0]
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json("error");
        }
    }
    // Delete comment
    static async deleteComment(req, res) {
        try {
            const user = req.user;
            const commentId = req.params.commentId;

            if (!commentId) {
                return res.status(404).json({
                    message: "Invalid or missing comment ID",
                    code: 404
                });
            }
            const commentInDb = await Comment.findOne({
                where: {
                    id: commentId,
                    UserId: user.id
                }
            });

            if (commentInDb === null) {
                return res.status(404).json({
                    message: "Comment Tidak ditemukan",
                    name: "Error",
                    code: 404
                });
            }


            if (user.id !== commentInDb.UserId) {
                throw {
                    code: 401,
                    message: 'Anda tidak bisa menghapus comment ini'
                };
            }

            const deleteComment = await Comment.destroy({
                where: {
                    id: commentId
                },
                returning: true
            });

            if (deleteComment === 0) {
                throw {
                    code: 400,
                    message: "Gagal Hapus Comment"
                };
            }
            return res.status(200).json({
                message: "Your comment has been successfully deleted"
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

module.exports = CommentController;

