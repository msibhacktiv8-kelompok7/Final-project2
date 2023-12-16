const request = require("supertest")
const { createToken } = require("../utils/bcrypt")
const { User } = require("../models")
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

// Sukses Testing User Register
describe("POST /users/register", () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
        } catch (error) {
            console.log(error)
        }
    })

    it("should send response with 201 status code", (done) => {
        request(app)
            .post("/users/register")
            .send(dummyUser)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }

                // Min 5 expects
                expect(res.status).toEqual(201)
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("User.email")
                expect(res.body).toHaveProperty("User.full_name")
                expect(res.body).toHaveProperty("User.profile_image_url")
                expect(res.body).toHaveProperty("User.age")
                expect(res.body).toHaveProperty("User.phone_number")
                expect(res.body.User.email).toEqual(dummyUser.email)
                expect(res.body.User.full_name).toEqual(dummyUser.full_name)
                expect(res.body.User.profile_image_url).toEqual(
                    dummyUser.profile_image_url
                )
                expect(res.body.User.age).toEqual(dummyUser.age)
                expect(res.body.User.phone_number).toEqual(dummyUser.phone_number)
                done()
            })
    })
})

// Gagal Testing User Register
describe("POST /users/register", () => {
    beforeAll(async () => {
        try {
            await User.create(dummyUser)
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

    it("should send response with 401 status code", (done) => {
        request(app)
            .post("/users/register")
            .send(dummyUser)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.text).toEqual(
                    '{"message":"email sudah terdaftar"}'
                )
                expect(res.created).toEqual(false)
                expect(res.accepted).toEqual(false)
                expect(res.unauthorized).toEqual(true)
                done()
            })
    })
})

// Success Testing User Login
describe("POST /users/login", () => {
    beforeAll(async () => {
        try {
            await User.create(dummyUser)
        } catch (err) {
            console.log(err)
        }
    })

    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
        } catch (error) {
            console.log(error)
        }
    })

    it("should send response with 200 status code", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: dummyUser.email,
                password: dummyUser.password,
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(200)
                expect(res.type).toEqual("application/json")
                expect(res.statusType).toEqual(2)
                expect(res.ok).toEqual(true)
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("token")
                expect(typeof res.body.token).toEqual("string")
                done()
            })
    })
})

// Failed Testing User Login
describe("POST /users/login", () => {
    beforeAll(async () => {
        try {
            await User.create(dummyUser)
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

    it("should send response with 401 status code", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: "usertesting@gmail.com",
                password: "usertestingpassword123",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(401)
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("User not found")
                done()
            })
    })
})


// Success & Failed Testing User Update
describe("PUT /users/:id", () => {
    let id
    let token
    beforeAll(async () => {
        try {

            const user = await User.create(dummyUser)
            id = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
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

    // Error id 404 not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .put("/users/" + 555)
            .set("Authorization", token)
            .send({
                email: "tester@gmail.com",
                full_name: "tester",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.type).toEqual("application/json")
                expect(res.status).toEqual(404)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("User tidak ditemukan")
                done()
            })
    })

    // Update success 200
    it("should send response with 200 status code", (done) => {
        request(app)
            .put("/users/" + id)
            .set("Authorization", token)
            .send({
                email: "tester@gmail.com",
                full_name: "tester",
            })
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                // Min 5 expects
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(res.body.user).toHaveProperty("email")
                expect(res.body.user).toHaveProperty("username")
                expect(res.body.user).toHaveProperty("profile_image_url")
                expect(res.body.user).toHaveProperty("age")
                expect(res.body.user).toHaveProperty("phone_number")
                done()
            })
    })

    // // Error not insert token
    it("should send response with 401 status code", (done) => {
        request(app)
            .put("/users/" + id)
            .send({
                email: "tester@gmail.com",
                full_name: "tester",
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

})

// Success & Failed Testing User Delete
describe("DELETE /users/:id", () => {
    let id
    let token
    beforeAll(async () => {
        try {
            const user = await User.create(dummyUser)
            id = user.id
            token = createToken({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
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

    // Error because id not found
    it("should send response with 404 status code", (done) => {
        request(app)
            .delete("/users/" + 645)
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.type).toEqual("application/json")
                expect(typeof res.body).toEqual("object")
                expect(res.status).toEqual(404)
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual("User Not Found")
                done()
            })
    })

    // Error for not including token
    it("should send response with 401 status code", (done) => {
        request(app)
            .delete("/users/" + id)
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

    // // Success delete
    it("should send response with 200 status code", (done) => {
        request(app)
            .delete("/users/" + id)
            .set("Authorization", token)
            .end(function (err, res) {
                if (err) {
                    done(err)
                }
                expect(res.status).toEqual(200)
                expect(res.statusType).toEqual(2)
                expect(res.type).toEqual("application/json")
                expect(res.unauthorized).toEqual(false)
                expect(typeof res.body).toEqual("object")
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toEqual(
                    "Your Account has been successfully deleted"
                )
                done()
            })
    })
})