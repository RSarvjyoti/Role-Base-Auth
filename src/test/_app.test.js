const request = require("supertest");
const app = require("../app");
const userModel = require("../models/user.model");
const albumModel = require("../models/album.model");
const musicModel = require("../models/music.model");
const mongoose = require("mongoose");
require("dotenv").config();

// Connect to database before running tests
beforeAll(async () => {
  try {
    const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/rbas-test";
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to test database");
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
});

// Disconnect from database after all tests
afterAll(async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from test database");
  } catch (error) {
    console.error("Error disconnecting from database", error);
  }
});

let userToken;
let artistToken;
let userId;
let artistId;
let albumId;
let musicId;

// ==================== AUTH TESTS ====================
describe("Authentication APIs", () => {
  afterEach(async () => {
    // Clean up test data after each test
    await userModel.deleteMany({ email: { $regex: "test" } });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", (done) => {
      const newUser = {
        username: "testuser123",
        email: "test@example.com",
        password: "password123",
        role: "user",
      };

      request(app)
        .post("/api/auth/register")
        .send(newUser)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toHaveProperty("message");
          expect(res.body).toHaveProperty("user");
          expect(res.body.user.username).toBe(newUser.username);
          expect(res.body.user.email).toBe(newUser.email);
          userToken = res.headers["set-cookie"];
          userId = res.body.user._id;
          done();
        });
    });

    it("should register a new artist successfully", (done) => {
      const newArtist = {
        username: "testartist123",
        email: "artist@example.com",
        password: "password123",
        role: "artist",
      };

      request(app)
        .post("/api/auth/register")
        .send(newArtist)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.user.role).toBe("artist");
          artistToken = res.headers["set-cookie"];
          artistId = res.body.user._id;
          done();
        });
    });

    it("should return 409 if user already exists", (done) => {
      const user = {
        username: "duplicate",
        email: "duplicate@example.com",
        password: "password123",
      };

      request(app)
        .post("/api/auth/register")
        .send(user)
        .end(() => {
          request(app)
            .post("/api/auth/register")
            .send(user)
            .expect(409)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.message).toContain("already exist");
              done();
            });
        });
    });

    it("should return 500 if required fields are missing", (done) => {
      const incompleteUser = {
        username: "incomplete",
        // missing email and password
      };

      request(app)
        .post("/api/auth/register")
        .send(incompleteUser)
        .expect(500)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach((done) => {
      const user = {
        username: "logintest",
        email: "logintest@example.com",
        password: "password123",
        role: "user",
      };

      request(app)
        .post("/api/auth/register")
        .send(user)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("should login user with username", (done) => {
      const loginData = {
        username: "logintest",
        password: "password123",
      };

      request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toContain("logged in successfully");
          expect(res.body.user).toBeDefined();
          expect(res.headers["set-cookie"]).toBeDefined();
          done();
        });
    });

    it("should login user with email", (done) => {
      const loginData = {
        email: "logintest@example.com",
        password: "password123",
      };

      request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toContain("logged in successfully");
          done();
        });
    });

    it("should return 401 for invalid credentials", (done) => {
      const loginData = {
        username: "logintest",
        password: "wrongpassword",
      };

      request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toContain("Invalid credentials");
          done();
        });
    });

    it("should return 401 for non-existent user", (done) => {
      const loginData = {
        username: "nonexistent",
        password: "password123",
      };

      request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toContain("Invalid credentials");
          done();
        });
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout user successfully", (done) => {
      const user = {
        username: "logouttest",
        email: "logouttest@example.com",
        password: "password123",
      };

      request(app)
        .post("/api/auth/register")
        .send(user)
        .end((err, res) => {
          if (err) return done(err);
          const cookies = res.headers["set-cookie"];

          request(app)
            .post("/api/auth/logout")
            .set("Cookie", cookies)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.message).toContain("logged out");
              done();
            });
        });
    });
  });
});

// ==================== ALBUM TESTS ====================
describe("Album APIs", () => {
  let artistToken;
  let userToken;

  beforeAll((done) => {
    // Register artist
    const artist = {
      username: "albumartist",
      email: "albumartist@example.com",
      password: "password123",
      role: "artist",
    };

    request(app)
      .post("/api/auth/register")
      .send(artist)
      .end((err, res) => {
        if (err) return done(err);
        artistToken = res.headers["set-cookie"];

        // Register user
        const user = {
          username: "albumuser",
          email: "albumuser@example.com",
          password: "password123",
          role: "user",
        };

        request(app)
          .post("/api/auth/register")
          .send(user)
          .end((err, res) => {
            if (err) return done(err);
            userToken = res.headers["set-cookie"];
            done();
          });
      });
  });

  describe("POST /api/album/create", () => {
    it("should create an album with artist authentication", (done) => {
      const albumData = {
        title: "Test Album",
        description: "A test album",
      };

      request(app)
        .post("/api/album/create")
        .set("Cookie", artistToken)
        .send(albumData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toHaveProperty("_id");
          expect(res.body.title).toBe(albumData.title);
          albumId = res.body._id;
          done();
        });
    });

    it("should return 401 if not authenticated", (done) => {
      const albumData = {
        title: "Test Album",
        description: "A test album",
      };

      request(app)
        .post("/api/album/create")
        .send(albumData)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("should return 403 if user role is not artist", (done) => {
      const albumData = {
        title: "Test Album",
        description: "A test album",
      };

      request(app)
        .post("/api/album/create")
        .set("Cookie", userToken)
        .send(albumData)
        .expect(403)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toContain("access");
          done();
        });
    });
  });

  describe("GET /api/album", () => {
    it("should get all albums with user authentication", (done) => {
      request(app)
        .get("/api/album")
        .set("Cookie", userToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(Array.isArray(res.body)).toBe(true);
          done();
        });
    });

    it("should get all albums with artist authentication", (done) => {
      request(app)
        .get("/api/album")
        .set("Cookie", artistToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(Array.isArray(res.body)).toBe(true);
          done();
        });
    });

    it("should return 401 if not authenticated", (done) => {
      request(app)
        .get("/api/album")
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET /api/album/album/:albumId", () => {
    it("should get album by id without authentication", (done) => {
      request(app)
        .get(`/api/album/album/${albumId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toHaveProperty("_id");
          done();
        });
    });

    it("should return 404 for invalid album id", (done) => {
      const invalidId = "000000000000000000000000";

      request(app)
        .get(`/api/album/album/${invalidId}`)
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});

// ==================== MUSIC TESTS ====================
describe("Music APIs", () => {
  let artistToken;
  let userToken;

  beforeAll((done) => {
    // Register artist
    const artist = {
      username: "musicartist",
      email: "musicartist@example.com",
      password: "password123",
      role: "artist",
    };

    request(app)
      .post("/api/auth/register")
      .send(artist)
      .end((err, res) => {
        if (err) return done(err);
        artistToken = res.headers["set-cookie"];

        // Register user
        const user = {
          username: "musicuser",
          email: "musicuser@example.com",
          password: "password123",
          role: "user",
        };

        request(app)
          .post("/api/auth/register")
          .send(user)
          .end((err, res) => {
            if (err) return done(err);
            userToken = res.headers["set-cookie"];
            done();
          });
      });
  });

  describe("POST /api/music/upload", () => {
    it("should upload music with artist authentication", (done) => {
      request(app)
        .post("/api/music/upload")
        .set("Cookie", artistToken)
        .field("title", "Test Song")
        .field("description", "A test song")
        .attach("music", Buffer.from("fake audio content"), "test.mp3")
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).toHaveProperty("_id");
          expect(res.body.title).toBe("Test Song");
          musicId = res.body._id;
          done();
        });
    });

    it("should return 401 if not authenticated", (done) => {
      request(app)
        .post("/api/music/upload")
        .field("title", "Test Song")
        .field("description", "A test song")
        .attach("music", Buffer.from("fake audio content"), "test.mp3")
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("should return 403 if user role is not artist", (done) => {
      request(app)
        .post("/api/music/upload")
        .set("Cookie", userToken)
        .field("title", "Test Song")
        .field("description", "A test song")
        .attach("music", Buffer.from("fake audio content"), "test.mp3")
        .expect(403)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toContain("access");
          done();
        });
    });
  });

  describe("GET /api/music", () => {
    it("should get all music with user authentication", (done) => {
      request(app)
        .get("/api/music")
        .set("Cookie", userToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(Array.isArray(res.body)).toBe(true);
          done();
        });
    });

    it("should get all music with artist authentication", (done) => {
      request(app)
        .get("/api/music")
        .set("Cookie", artistToken)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(Array.isArray(res.body)).toBe(true);
          done();
        });
    });

    it("should return 401 if not authenticated", (done) => {
      request(app)
        .get("/api/music")
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});