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

const photo_create = {
	poster_image_url:
		"https://lh3.googleusercontent.com/-Bw3QgAP2Rg0/AAAAAAAAAAI/AAAAAAAAB9I/Ow8KOJDTsJE/photo.jpg?sz=256",
	title: "Photos",
	caption: "This is the caption of the photo",
};

const comment_create = {
	comment: "comment ini hanyalah percobaan",
};

const comment_update = {
	comment: "comment ini merupakan hasil editan",
};

beforeAll(async (done) => {
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

describe("POST /comments", () => {
	// create photos instance
	beforeAll((done) => {
		request(app)
			.post(`/api/v1/photos`)
			.set("token", `${token}`)
			.send(photo_create)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					done();
				}
			});
	});

	test("Successfully create a comment", (done) => {
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

describe("GET /comments", () => {
	beforeAll((done) => {
		request(app)
			.post(`/api/v1/photos`)
			.set("token", `${token}`)
			.send(photo_create)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					done();
				}
			});
	});
	test("See all comments", (done) => {
		request(app)
			.get("/api/v1/comments")
			.set("Accept", "application/json")
			.set("token", `${token}`)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				expect(res.body).toHaveProperty("comments");
				expect(res.body.comments.length).toBeGreaterThan(0);

				//const commentsLength = res.body.comments.length;

				expect(res.statusCode).toBe(200)
				expect(typeof res).toBe("object")
				expect(res.body).toHaveProperty('comments')
				expect(res.body.comments[0]).toHaveProperty('id')
				expect(res.body.comments[0]).toHaveProperty('user_id')
				expect(res.body.comments[0]).toHaveProperty('photo_id')
				expect(res.body.comments[0]).toHaveProperty('comment')
				expect(res.body.comments[0]).toHaveProperty('updatedAt')
				expect(res.body.comments[0]).toHaveProperty('createdAt')

				return done();
			});
	});
});

describe("PUT /comments/:commetId", () => {
	beforeAll((done) => {
		request(app)
			.post(`/api/v1/photos`)
			.set("token", `${token}`)
			.send(photo_create)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					done();
				}
			});
	});
	test("Successfully edit a comment", (done) => {
		request(app)
			.put(`/api/v1/comments/${commentId}`)
			.send(commentEditData)
			.set("Accept", "application/json")
			.set("token", `${token}`)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				expect(res.body).toHaveProperty("comment");
				expect(res.body.comment).toHaveProperty("id");
				expect(res.body.comment).toHaveProperty("comment");
				expect(res.body.comment.comment).toBe(commentEditData.comment);
				expect(res.body.comment).toHaveProperty("user_id");
				expect(res.body.comment).toHaveProperty("photo_id");
				//expect(res.body.comment.PhotoId).toBe(lastPhotoId);
				expect(res.body.comment).toHaveProperty("updatedAt");
				expect(res.body.comment).toHaveProperty("createdAt");

				return done();
			});
	});
});

describe("DELETE /comments/:commentId", () => {
	beforeAll((done) => {
		request(app)
			.post(`/api/v1/photos`)
			.set("token", `${token}`)
			.send(photo_create)
			.end((err, res) => {
				if (err) {
					console.log(err);
					done();
				} else {
					done();
				}
			});
	});
	test("Successfully delete a comment", (done) => {
		request(app)
			.delete(`/api/v1/comments/${commentId}`)
			.set("Accept", "application/json")
			.set("token", `${token}`)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);

				expect(res.body).toHaveProperty("message");
				expect(res.body).toBeDefined();
				expect(res.body).not.toBeNull();
				expect(res.body.message).toBe("Your comment has been successfully deleted");
				expect(res.body.message).toMatch(/deleted/);

				return done();
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
