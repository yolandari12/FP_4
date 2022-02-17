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

const user_login = {
	email: "user_testing@gmail.com",
	password: "123",
};

beforeEach((done) => {
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
});

describe("Testing after login", () => {
	beforeEach((done) => {
		request(app)
			.post("/api/v1/users/register")
			.send(user_register)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					console.log(res.body.token);
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
					token = res.body.token;
					expect(res.body).toHaveProperty("token");
					expect(res.body.token).not.toBeUndefined();
					expect(res.body.token).not.toBeNull();
					expect(res.body.token).not.toHaveLength(0);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
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

jest.setTimeout(60000);
