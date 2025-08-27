// 5. Tests d'intégration (3 tests)
const request = require("supertest");
const mockingoose = require("mockingoose");
const jwt = require("jsonwebtoken");

const { app } = require("../server");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");
const TOKEN = "any.token";

jest.spyOn(jwt, "verify").mockImplementation(() => ({ userId: "u-test" }));

const asRole = (role) =>
  jest.spyOn(User, "findById").mockResolvedValue({
    _id: "u-test",
    name: role === "admin" ? "Admin" : "Member",
    email: `${role}@example.com`,
    role,
    password: undefined,
  });

describe("API /api/articles (3 tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll();

    jest.spyOn(jwt, "verify").mockImplementation(() => ({ userId: "u-test" }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("POST /api/articles → 201 (membre connecté)", async () => {
    asRole("member");
    const body = { title: "Hello", content: "World", status: "draft" };

    mockingoose(Article).toReturn(
      { _id: "a1", ...body, user: "u-test" },
      "save"
    );

    mockingoose(Article).toReturn(
      { _id: "a1", ...body, user: { _id: "u-test", name: "Member" } },
      "findOne"
    );

    const res = await request(app)
      .post("/api/articles")
      .set("x-access-token", TOKEN)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title", "Hello");

    if (res.body.user) {
      expect(res.body.user).toHaveProperty("name");
    }
  });

  test("PUT /api/articles/:id → 200 (admin)", async () => {
    asRole("admin");

    const articleId = "a2";
    const update = { title: "Updated", status: "published" };

    mockingoose(Article).toReturn(
      {
        _id: articleId,
        title: "Updated",
        content: "World",
        status: "published",
        user: "u-test",
      },
      "findOneAndUpdate"
    );

    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .set("x-access-token", TOKEN)
      .send(update);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Updated");
    expect(res.body).toHaveProperty("status", "published");
  });

  test("DELETE /api/articles/:id → 204 (admin)", async () => {
    asRole("admin");

    const articleId = "a3";
    mockingoose(Article).toReturn(
      {
        _id: articleId,
        title: "X",
        content: "Y",
        status: "draft",
        user: "u-test",
      },
      "findOneAndDelete"
    );

    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set("x-access-token", TOKEN);

    expect(res.status).toBe(204);
  });
});
