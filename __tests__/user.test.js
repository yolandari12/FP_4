const app = require("../app.js");
const request = require("supertest");
const { User } = require("../models");

const user_register = {
	email: "user_testing@gmail.com",
	username: "user_testing",
	password: "123",
	full_name: "user",
	age: "20",
	phone_number: "081234567890",
	profile_image_url: "https://example.com",
};

const user_update = {
	username: "user_testing_update",
	full_name: "user_update",
	age: "19",
	phone_number: "081111111111",
	profile_image_url: "https://example.update.com",
};

const user_login = {
	email: "user_testing@gmail.com",
	password: "123",
};

describe("successfully register", () => {
	test("successfully register", (done) => {
		request(app)
			.post("/api/v1/users/register")
			.send(user_register)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					expect(res.body).toHaveProperty("user");
					expect(res.body.user).not.toBeNull();
					expect(res.body.user.email).toBe(user_register.email);
					expect(res.body.user).toHaveProperty("full_name");
					expect(res.body.user.full_name).toBe(user_register.full_name);
					expect(res.statusCode).toBe(201);
					done();
				}
			});
	});

	afterEach((done) => {
		User.destroy({ where: { email: "user_testing@gmail.com" } })
			.then(() => {
				console.log("successfully delete user testing");
				done();
			})
			.catch((err) => {
				console.log(err);
				done();
			});
	});
});

describe("Testing login", () => {
	beforeEach((done) => {
		request(app)
			.post("/api/v1/users/register")
			.send(user_register)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					done();
				}
			});
	});

	test("successfully login", (done) => {
		request(app)
			.post("/api/v1/users/login")
			.send(user_login)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.body).toHaveProperty("token");
					expect(res.body.token).not.toBeUndefined();
					expect(res.body.token).not.toBeNull();
					expect(res.body.token).not.toHaveLength(0);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
	});

	afterEach((done) => {
		User.destroy({ where: { email: "user_testing@gmail.com" } })
			.then(() => {
				console.log("successfully delete user testing");
				done();
			})
			.catch((err) => {
				console.log(err);
				done();
			});
	});
});

describe("Update and delete user", () => {
	let token_update_delete;

	beforeAll((done) => {
		request(app)
			.post("/api/v1/users/register")
			.send(user_register)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					done();
				}
			});
	});

	beforeEach((done) => {
		request(app)
			.post("/api/v1/users/login")
			.send(user_login)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					token_update_delete = res.body.token;
					console.log(res.body.token);
					done();
				}
			});
	});

	test("successfully edit user", async (done) => {
		let user_instance = await User.findOne({ where: { email: "user_testing@gmail.com" } });
		let user_id = user_instance.dataValues.id;

		request(app)
			.put(`/api/v1/users/${user_id}`)
			.set("token", `${token_update_delete}`)
			.send(user_update)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.body).toHaveProperty("user");
					expect(res.body.user).toHaveProperty("full_name");
					expect(res.body.user.full_name).toBe(user_update.full_name);
					expect(res.body.user).toHaveProperty("username");
					expect(res.body.user.username).toBe(user_update.username);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
	});

	test("successfully delete user", async (done) => {
		let user_instance = await User.findOne({ where: { email: "user_testing@gmail.com" } });
		let user_id = user_instance.dataValues.id;

		request(app)
			.delete(`/api/v1/users/${user_id}`)
			.set("token", `${token_update_delete}`)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.body).toHaveProperty("message");
					expect(res.body.message).not.toBeUndefined();
					expect(res.body.message).not.toBeNull();
					expect(res.body.message).not.toHaveLength(0);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
	});
});

afterAll((done) => {
	User.destroy({ where: { email: "user_testing@gmail.com" } })
		.then(() => {
			console.log("successfully delete user testing");
			done();
		})
		.catch((err) => {
			console.log(err);
			done();
		});
});

jest.setTimeout(60000);
