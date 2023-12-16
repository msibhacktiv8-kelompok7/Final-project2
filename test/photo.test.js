const request = require("supertest")
const { User, Photo } = require("../models")
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


describe("POST /photos", () => {
    let id
    let token

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            id = user.id
            token = createToken({
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            })
        } catch (error) {
            console.log(error)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
        } catch (error) {
            console.log(error)
        }
    })

    // Success Testing Create Photo
    it("should send response with 201 status code", (done) => {
        request(app)
            .post("/photos")
            .set("Authorization", token)
            .send({
                title: "photo",
                caption: "photo",
                poster_image_url: "photo.com",
                UserId: id,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.statusCode).toEqual(201)
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("id")
                expect(res.body).toHaveProperty("poster_image_url")
                expect(res.body).toHaveProperty("title")
                expect(res.body).toHaveProperty("caption")
                expect(res.body).toHaveProperty("UserId")
                done()
            })
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .post("/photos")
            .send({
                title: "Phgoto",
                caption: "Phgoto",
                poster_image_url: "Phgoto.com",
                UserId: id,
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

    // // Error because validation does not match
    it("should send response with 401 status code", (done) => {
        request(app)
            .post("/photos")
            .set("Authorization", token)
            .send({
                title: "",
                caption: "",
                poster_image_url: "",
                UserId: id,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("name")
                expect(res.body).toHaveProperty("errors")
                expect(res.body.name).toEqual("SequelizeValidationError")
                expect(typeof res.body.errors).toEqual("object")
                done()
            })
    })
})

describe("GET /photos", () => {
    let id
    let token

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            id = user.id
            token = createToken({
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            })
        } catch (error) {
            console.log(error)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
        } catch (error) {
            console.log(error)
        }
    })

    // Success Testing Get All Photos
    it("should send response with 200 status code", (done) => {
        request(app)
            .get("/photos")
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.statusCode).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.ok).toEqual(true)
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("photos")
                expect(typeof res.body.photos).toEqual("object")
                done()
            })
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .get("/photos")
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



describe("PUT /photos/:id", () => {
    let id
    let token
    let photoId
    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            id = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })

            const photo = await Photo.create({
                title: "OPhoto",
                caption: "OPhoto",
                poster_image_url: "OPhoto.com",
                UserId: id,
            })
            photoId = photo.id
        } catch (err) {
            console.log(err)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .put("/photos/" + id)
            .send({
                title: "OPhoto",
                caption: "OPhoto",
                poster_image_url: "OPhoto@gmail.com",
                UserId: id,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Unauthorized")
                done()
            })
    })

    // Error because id not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .put("/photos/" + 999)
            .set("Authorization", token)
            .send({
                title: "Photo",
                caption: "Photo",
                poster_image_url: "Photo.com",
                UserId: id,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.status).toEqual(404)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Photo Tidak ditemukan")
                done()
            })
    })

    // // Error because did not fill the field/column
    it("should send response with 401 status code", (done) => {
        request(app)
            .put("/photos/" + photoId)
            .set("Authorization", token)
            .send({
                title: "",
                caption: "",
                poster_image_url: "",
                UserId: id,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.status).toEqual(401)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Data yang anda masukkan kosong")
                done()
            })
    })

    // // Success update
    it("should send response with 200 status code", (done) => {
        request(app)
            .put("/photos/" + photoId)
            .set("Authorization", token)
            .send({
                title: "Ini Phtoto",
                caption: "Ini Phtoto",
                poster_image_url: "IniPhtoto.com",
                UserId: id,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.status).toEqual(200)
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("photo")
                expect(res.body.photo).toHaveProperty("id")
                expect(res.body.photo).toHaveProperty("title")
                expect(res.body.photo).toHaveProperty("caption")
                expect(res.body.photo).toHaveProperty("poster_image_url")
                expect(res.body.photo).toHaveProperty("UserId")
                expect(res.body.photo).toHaveProperty("createdAt")
                expect(res.body.photo).toHaveProperty("updatedAt")
                done()
            })
    })
})

describe("DELETE /photos/:id", () => {
    let id
    let token
    let photoId
    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            id = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })

            const photo = await Photo.create({
                title: "Ini Photo",
                caption: "Ini Photo",
                poster_image_url: "iniphoto.com",
                UserId: id,
            })
            photoId = photo.id
        } catch (err) {
            console.log(err)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .delete("/photos/" + photoId)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.status).toEqual(401)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Unauthorized")
                done()
            })
    })

    // Error because id not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .delete("/photos/" + 999)
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.status).toEqual(404)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Photo Tidak ditemukan")
                done()
            })
    })

    // // Success delete photo
    it("should send response with 200 status code", (done) => {
        request(app)
            .delete("/photos/" + photoId)
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.status).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual(
                    "Your Photo has been successfully deleted"
                )

                done()
            })
    })
})