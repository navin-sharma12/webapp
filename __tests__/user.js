import app from "../server.js";
import request from "supertest";

describe("healthCheck ", () => {
  test("It should respond 200", async () => {
    const response = await request(app).get("/healthz");
    expect(response.statusCode).toBe(200);
  });
});