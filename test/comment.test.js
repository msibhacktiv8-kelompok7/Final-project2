const request = require("supertest")
const { User, Photo, Comment } = require("../models")
const { createToken } = require("../utils/bcrypt")
const app = require("../app")

const dummyUser = {
    full_name: "Super Admin",
    email: "superadmin@gmail.com",
    username: "superadmin",
    password: "123456",
    profile_image_url: "admin.com",
    age: 30,
    phone_number: "877855564",
}

describe("POST /comments", () => {
    let UserId
    let token
    let PhotoId

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            UserId = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
            const photoData = {
                title: "Photo Testing",
                caption: "Caption Testing",
                poster_image_url: "testing.com",
                UserId: UserId,
            }
            const photo = await Photo.create(photoData)
            PhotoId = photo.id
        } catch (err) {
            console.log(err)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
            await Comment.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })

    // Success Testing Create Comment
    it("should send response with 201 status code", (done) => {
        request(app)
            .post("/comments")
            .set("Authorization", token)
            .send({
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "This is my comment",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(201)
                expect(res.body).toHaveProperty("comments")
                expect(res.body.comments).toHaveProperty("id")
                expect(res.body.comments).toHaveProperty("UserId")
                expect(res.body.comments).toHaveProperty("PhotoId")
                expect(res.body.comments).toHaveProperty("comment")
                expect(res.body.comments).toHaveProperty("updatedAt")
                expect(res.body.comments).toHaveProperty("createdAt")
                done()
            })
    })

    // // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .post("/comments")
            .send({
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "This is comment",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Unauthorized")
                done()
            })
    })

    // // Error because PhotoId not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .post("/comments")
            .set("Authorization", token)
            .send({
                UserId: UserId,
                PhotoId: 999,
                comment: "Its comment",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(404)
                expect(res.type).toEqual("application/json")
                expect(res.statusType).toEqual(4)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("User id anda tidak ditemukan")
                done()
            })
    })
})


describe("GET /comments", () => {
    let token

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
        } catch (err) {
            console.log(err)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })

    // Success Testing Get Comment
    it("should send response with 200 status code", (done) => {
        request(app)
            .get("/comments")
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.type).toEqual("application/json")
                expect(res.ok).toEqual(true)
                expect(res.body).toHaveProperty("comments")
                expect(typeof res.body).toEqual("object")
                done()
            })
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .get("/comments")
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Unauthorized")
                done()
            })
    })
})


describe("PUT /comments/:id", () => {
    let UserId
    let token
    let PhotoId
    let commentId

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            UserId = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
            const photoData = {
                title: "Testing Photo",
                caption: "Testing Photo",
                poster_image_url: "testing.com",
                UserId: UserId,
            }
            const photo = await Photo.create(photoData)
            PhotoId = photo.id

            const commentData = {
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "This is my comment",
            }
            const comment = await Comment.create(commentData)
            commentId = comment.id
        } catch (err) {
            console.log(err)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
            await Comment.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .put("/comments/" + commentId)
            .send({
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "This is my comment",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Unauthorized")
                done()
            })
    })

    // Error because Comment not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .put("/comments/" + 565)
            .set("Authorization", token)
            .send({
                comment: "This is comment",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(404)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Comment Tidak ditemukan")
                done()
            })
    })

    // // Error because comment is empty
    it("should send response with 401 status code", (done) => {
        request(app)
            .put("/comments/" + commentId)
            .set("Authorization", token)
            .send({
                comment: "",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Data yang anda masukkan kosong")
                done()
            })
    })

    // Success Testing Update Comment
    it("should send response with 201 status code", (done) => {
        request(app)
            .put("/comments/" + commentId)
            .set("Authorization", token)
            .send({
                comment: "Hey you are cool..",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(201)
                expect(res.statusType).toEqual(2)
                expect(res.ok).toEqual(true)
                expect(res.body).toHaveProperty("comment")
                expect(res.type).toEqual("application/json")
                expect(typeof res.body.comment).toEqual("object")
                done()
            })
    })
})


describe("DELETE /comments/:id", () => {
    let UserId
    let token
    let PhotoId
    let commentId

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            UserId = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
            const photoData = {
                title: "Testing Photo",
                caption: "Testing Photo",
                poster_image_url: "testig.com",
                UserId: UserId,
            }
            const photo = await Photo.create(photoData)
            PhotoId = photo.id

            const commentData = {
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "Yeah",
            }
            const comment = await Comment.create(commentData)
            commentId = comment.id
        } catch (err) {
            console.log(err)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
            await Comment.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .delete("/comments/" + commentId)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Unauthorized")
                done()
            })
    })

    // Error because Comment not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .delete("/comments/" + 565)
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(404)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Comment Tidak ditemukan")
                done()
            })
    })

    // Error because did not input commentId
    it("should send response with 404 status code", (done) => {
        request(app)
            .delete("/comments/" + 999)
            .set("Authorization", token)
            .send({
                PhotoId,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.status).toEqual(404)
                expect(res.notFound).toEqual(true)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("code")
                expect(res.body).toHaveProperty("name")
                expect(res.body).toHaveProperty("message")
                expect(res.body.name).toEqual("Error")
                expect(res.body.code).toEqual(404)
                expect(res.body.message).toEqual("Comment Tidak ditemukan")
                done()
            })
    })

    // Success Testing Delete Comment
    it("should send response with 200 status code", (done) => {
        request(app)
            .delete("/comments/" + commentId)
            .set("Authorization", token)

            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("message")
                expect(typeof res.body).toEqual("object")
                expect(res.body.message).toEqual(
                    "Your comment has been successfully deleted"
                )
                done()
            })
    })
})