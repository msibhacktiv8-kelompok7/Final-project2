const request = require("supertest")
const { User, Photo, Comment, SosialMedia } = require("../models")
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

describe("POST /socialmedias", () => {
    let UserId
    let token

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
                title: "Ini Photo",
                caption: "Ini Photo",
                poster_image_url: "IniPhoto.com",
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

    // Success Testing Create Social Media
    it("should send response with 201 status code", (done) => {
        request(app)
            .post("/socilmedias")
            .set("Authorization", token)
            .send({
                name: "name",
                socialMediaUrl: "name.com",
                UserId,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(201)
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("social_media")
                expect(res.body.social_media).toHaveProperty("id")
                expect(res.body.social_media).toHaveProperty("UserId")
                expect(res.body.social_media).toHaveProperty("name")
                expect(res.body.social_media).toHaveProperty("sosial_media_url")
                expect(res.body.social_media).toHaveProperty("updatedAt")
                expect(res.body.social_media).toHaveProperty("createdAt")
                done()
            })
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .post("/socilmedias")
            .send({
                name: "testing",
                socialMediaUrl: "testing.com",
                UserId,
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


    // Error for missing required fields in the request body
    it("should send response with 400 status code for missing fields", (done) => {
        request(app)
            .post("/socilmedias")
            .set("Authorization", token)
            .send({
                // Missing 'name' field intentionally
                socialMediaUrl: "testing.com",
                UserId,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(400)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.badRequest).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Invalid or missing sosmed name")
                done()
            })
    })

})


describe("GET /socialmedias", () => {
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

    // Success Testing Get Social Media
    it("should send response with 200 status code", (done) => {
        request(app)
            .get("/socilmedias")
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
                expect(res.body).toHaveProperty("social_medias")
                expect(typeof res.body.social_medias).toEqual("object")
                done()
            })
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .get("/socilmedias")
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


describe("PUT /socialmedias/:id", () => {
    let UserId
    let token
    let socmedId

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            UserId = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
            let socmedData = {
                name: "testing",
                social_media_url: "testing.com",
                UserId,
            }
            const socmed = await SosialMedia.create(socmedData)
            socmedId = socmed.id
        } catch (err) {
            console.log(err)
        }
    })

    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await SosialMedia.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })

    // Error for missing required fields in the request body for an update
    it("should send response with 400 status code for missing fields during update", (done) => {
        request(app)
            .put("/socilmedias/" + socmedId)
            .set("Authorization", token)
            .send({
                // Missing 'name' field intentionally
                social_media_url: "testing.com",
                UserId,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(400)
                expect(res.statusType).toEqual(4)
                expect(res.type).toEqual("application/json")
                expect(res.badRequest).toEqual(true)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Invalid or missing fields for update")
                done()
            })
    })


    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .put("/socilmedias/" + socmedId)
            .send({
                name: "test update",
                social_media_url: "testupdate.com",
                UserId,
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


    // // Error because socmedId not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .put("/socilmedias/" + 404)
            .set("Authorization", token)
            .send({
                name: "testing",
                social_media_url: "testing.com",
                UserId,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(404)
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Sosial Media Tidak ditemukan")
                done()
            })
    })

    // // Success Testing Update Comment
    it("should send response with 200 status code", (done) => {
        request(app)
            .put("/socilmedias/" + socmedId)
            .set("Authorization", token)
            .send({
                name: "testing",
                social_media_url: "testing.com",
                UserId,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.ok).toEqual(true)
                expect(res.body).toHaveProperty("social_media")
                expect(res.type).toEqual("application/json")
                expect(typeof res.body.social_media).toEqual("object")
                console.log(res.body.social_media)
                expect(res.body.social_media).toHaveProperty("id")
                expect(res.body.social_media).toHaveProperty("name")
                expect(res.body.social_media).toHaveProperty("sosial_media_url")
                expect(res.body.social_media).toHaveProperty("UserId")
                expect(res.body.social_media).toHaveProperty("createdAt")
                expect(res.body.social_media).toHaveProperty("updatedAt")

                done()
            })
    })
})

describe("DELETE /socialmedias/:id", () => {
    let UserId
    let token
    let socmedId

    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            UserId = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            })
            let socmedData = {
                name: "tester",
                social_media_url: "tester.com",
                UserId,
            }
            const socmed = await SosialMedia.create(socmedData)
            socmedId = socmed.id
        } catch (err) {
            console.log(err)
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await SosialMedia.destroy({ where: {} })
        } catch (err) {
            console.log(err)
        }
    })


    // Error for not including token
    it("should send response with 401 status code instead of 400", (done) => {
        request(app)
            .delete("/socilmedias/" + socmedId)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Changed expectation to 400 intentionally
                expect(res.status).toEqual(401); // This expectation is deliberately set to fail
                expect(res.type).toEqual("application/json")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("Unauthorized")
                done()
            })
    })


    // Error for attempting to delete non-existent social media
    it("should send response with 404 status code for non-existent social media", (done) => {
        const nonExistentSocialMediaId = 999; // A non-existent social media ID

        request(app)
            .delete("/socilmedias/" + nonExistentSocialMediaId)
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                // Min 5 expects
                expect(res.status).toEqual(404);
                expect(res.type).toEqual("application/json");
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toEqual("Sosial Media Tidak ditemukan");

                done();
            });
    });

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .delete("/socilmedias/" + socmedId)
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

    // Success Testing Delete Comment
    it("should send response with 200 status code", (done) => {
        request(app)
            .delete("/socilmedias/" + socmedId)
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
                    "Your Social Media has been successfully deleted"
                )
                done()
            })
    })


})