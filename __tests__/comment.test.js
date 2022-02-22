const app = require("../app.js");
const request = require("supertest");
const { User, Comment, Photo } = require("../models");

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

beforeAll((done) => {
	request(app)
		.post("/api/v1/users/register")
		.send(user_register)
		.end((err) => {
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

describe("create comments", () => {
	// create photos instance
	let photo_instance;
	let photo_create = {
		poster_image_url:
			"https://lh3.googleusercontent.com/-Bw3QgAP2Rg0/AAAAAAAAAAI/AAAAAAAAB9I/Ow8KOJDTsJE/photo.jpg?sz=256",
		title: "Photos",
		caption: "This is the caption of the photo",
	};

	beforeAll(async (done) => {
		await Photo.create(photo_create);
		photo_instance = await Photo.findOne({ where: { title: "Photos" } });
		done();
	});

	test("Successfully create a comment", (done) => {
		let comment_create = {
			comment: "comment ini hanyalah percobaan",
			PhotoId: photo_instance.dataValues.id,
		};
		request(app)
			.post("/api/v1/comments")
			.set("Accept", "application/json")
			.set("token", `${token}`)
			.send(comment_create)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.statusCode).toBe(201);
					expect(res.body).toHaveProperty("comment");

					expect(res.body.comment).toHaveProperty("id");
					expect(res.body.comment.id).toBeGreaterThan(0);

					expect(res.body.comment).toHaveProperty("comment");
					expect(res.body.comment.comment).toBe(comment_create.comment);

					expect(res.body.comment).toHaveProperty("updatedAt");
					expect(res.body.comment).toHaveProperty("createdAt");

					done();
				}
			});
	});
});

describe("delete and update comments", () => {
	let comment_instance;
	let photo_create = {
		poster_image_url:
			"https://lh3.googleusercontent.com/-Bw3QgAP2Rg0/AAAAAAAAAAI/AAAAAAAAB9I/Ow8KOJDTsJE/photo.jpg?sz=256",
		title: "Photos",
		caption: "This is the caption of the photo",
	};

	beforeAll(async (done) => {
		await Photo.create(photo_create);
		photo_instance = await Photo.findOne({ where: { title: "Photos" } });
		done();
	});

	beforeEach(async (done) => {
		let comment_create = {
			comment: "comment ini hanyalah percobaan",
			PhotoId: photo_instance.dataValues.id,
		};
		await Comment.create(comment_create);

		comment_instance = await Comment.findAll({ where: { comment: "comment ini hanyalah percobaan" } });
		done();
	});

	test("Successfully get a comment", (done) => {
		request(app)
			.get(`/api/v1/comments`)
			.set("Accept", "application/json")
			.set("token", `${token}`)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.statusCode).toBe(200);
					expect(res.body).toHaveProperty("comments");

					expect(res.body.comments[0]).toHaveProperty("id");
					expect(res.body.comments[0].id).toBeGreaterThan(0);

					expect(res.body.comments[0]).toHaveProperty("updatedAt");
					expect(res.body.comments[0]).toHaveProperty("createdAt");

					done();
				}
			});
	});

	test("Successfully edit a comment", (done) => {
		let comment_update = {
			comment: "comment edited",
		};
		request(app)
			.put(`/api/v1/comments/${comment_instance[0].dataValues.id}`)
			.set("Accept", "application/json")
			.set("token", `${token}`)
			.send(comment_update)
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					expect(res.statusCode).toBe(200);
					expect(res.body).toHaveProperty("comment");

					expect(res.body.comment).toHaveProperty("id");
					expect(res.body.comment.id).toBeGreaterThan(0);

					expect(res.body.comment).toHaveProperty("comment");
					expect(res.body.comment.comment).toBe(comment_update.comment);

					expect(res.body.comment).toHaveProperty("updatedAt");
					expect(res.body.comment).toHaveProperty("createdAt");

					done();
				}
			});
	});

	test("Successfully delete a comment", (done) => {
		request(app)
			.delete(`/api/v1/comments/${comment_instance[0].dataValues.id}`)
			.set("Accept", "application/json")
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

afterAll(async (done) => {
	let user_testing = await User.findOne({ where: { email: "user_testing@gmail.com" } });
	await user_testing.destroy();
	await Comment.destroy({ where: { user_id: user_testing.dataValues.id } });
	await Photo.destroy({ where: { user_id: user_testing.dataValues.id } });
	done();
});
