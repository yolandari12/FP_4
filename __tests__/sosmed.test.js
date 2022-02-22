const app = require("../app.js");
const request = require("supertest");
const { User, SocialMedia } = require("../models");

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

const SocialMedia_create = {
	
	name: "SocialMedia",
	social_media_url:
		"https://lh3.googleusercontent.com/-Bw3QgAP2Rg0/AAAAAAAAAAI/AAAAAAAAB9I/Ow8KOJDTsJE/SocialMedia.jpg?sz=256",
};

const SocialMedia_update = {
	name: "SocialMedia",
	social_media_url:
		"https://lh3.googleusercontent.com/-Bw3QgAP2Rg0/AAAAAAAAAAI/AAAAAAAAB9I/Ow8KOJDTsJE/SocialMedia.jpg?sz=256",
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

describe("Create SocialMedias", () => {
	test("successfully create SocialMedia", async (done) => {
		request(app)
			.post(`/api/v1/socialmedias`)
			.set("token", `${token}`)
			.send(SocialMedia_create)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.body).toHaveProperty("social_media");
					expect(res.body.social_media.userId).toBe(user_id);
					expect(res.body.social_media.social_media_url).toBe(SocialMedia_create.social_media_url);
					expect(res.statusCode).toBe(201);
					done();
				}
			});
	});
});

describe("Get, Update, Delete SocialMedia", () => {
	let SocialMedia_instance;
	beforeAll((done) => {
		request(app)
			.post("/api/v1/socialmedias")
			.send(SocialMedia_create)
			.end(async (err) => {
				if (err) {
					console.log(err);
					done();
				} else {
					SocialMedia_instance = await SocialMedia.findAll({ where: { user_id: user_id } });
					done();
				}
			});
	});

	test("successfully get SocialMedia", async (done) => {
		request(app)
			.get(`/api/v1/socialmedias`)
			.set("token", `${token}`)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.body).toHaveProperty("social_medias");
					expect(Object.keys(SocialMedia_instance).length).toBe(1);
					expect(res.body.social_medias[0].poster_image_url).toBe(SocialMedia_create.poster_image_url);
					expect(res.body.social_medias[0].user_id).toBe(user_id);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
	});

	test("successfully update SocialMedia", async (done) => {
		request(app)
			.put(`/api/v1/socialmedias/${SocialMedia_instance[0].dataValues.id}`)
			.set("token", `${token}`)
			.send(SocialMedia_update)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					let test = res.body;
					expect(res.body).toHaveProperty("social_media");
					expect(Object.keys(SocialMedia_instance).length).toBe(1);
					expect(res.body.social_media.poster_image_url).toBe(SocialMedia_update.poster_image_url);
					expect(res.body.social_media.user_id).toBe(user_id);
					expect(res.statusCode).toBe(200);
					done();
				}
			});
	});

	test("successfully delete SocialMedia", async (done) => {
		request(app)
			.delete(`/api/v1/socialmedias/${SocialMedia_instance[0].dataValues.id}`)
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
