const app = require("../app.js");
const request = require("supertest");
const { User, Photo } = require("../models");

let token, user_instance, user_id;

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

const photo_create = {
	poster_image_url:
		"https://lh3.googleusercontent.com/-Bw3QgAP2Rg0/AAAAAAAAAAI/AAAAAAAAB9I/Ow8KOJDTsJE/photo.jpg?sz=256",
	title: "Photos",
	caption: "This is the caption of the photo",
};

const photo_update = {
	poster_image_url: "https://example.com",
	title: "Photos update",
	caption: "updated caption",
};

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
		.end(async (err, res) => {
			if (err) {
				console.log(err);
				done();
			} else {
				token = res.body.token;
				user_instance = await User.findOne({ where: { email: "user_testing@gmail.com" } });
				user_id = user_instance.dataValues.id;
				done();
			}
		});
});

describe("Create photos", () => {
	test("successfully create photo", async (done) => {
		request(app)
			.post(`/api/v1/photos`)
			.set("token", `${token}`)
			.send(photo_create)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.body).toHaveProperty("title");
					expect(res.body.userId).toBe(user_id);
					expect(res.body.poster_image_url).not.toBeNull();
					expect(res.body.caption).toBe(photo_create.caption);
					expect(res.statusCode).toBe(201);
					done();
				}
			});
	});
});

describe("Get, Update, Delete Photo", () => {
	let photo_instance;
	beforeAll((done) => {
		request(app)
			.post("/api/v1/photos")
			.send(photo_create)
			.end(async (err) => {
				if (err) {
					console.log(err);
					done();
				} else {
					photo_instance = await Photo.findAll({ where: { user_id: user_id } });
					done();
				}
			});
	});

	test("successfully get photo", async (done) => {
		request(app)
			.get(`/api/v1/photos`)
			.set("token", `${token}`)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.body).toHaveProperty("photos");
					expect(Object.keys(photo_instance).length).toBe(1);
					expect(res.body.photos[0].poster_image_url).toBe(photo_create.poster_image_url);
					expect(res.body.photos[0].user_id).toBe(user_id);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
	});

	test("successfully update photo", async (done) => {
		request(app)
			.put(`/api/v1/photos/${photo_instance[0].dataValues.id}`)
			.set("token", `${token}`)
			.send(photo_update)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					let test = res.body;
					expect(res.body).toHaveProperty("photo");
					expect(Object.keys(photo_instance).length).toBe(1);
					expect(res.body.photo.poster_image_url).toBe(photo_update.poster_image_url);
					expect(res.body.photo.user_id).toBe(user_id);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
	});

	test("successfully delete photo", async (done) => {
		request(app)
			.delete(`/api/v1/photos/${photo_instance[0].dataValues.id}`)
			.set("token", `${token}`)
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
