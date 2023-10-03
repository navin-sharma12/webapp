import app from '../server';
import request from "supertest";

describe("GET /healthz ", () => {
  test("It should respond 200", async () => {
    const response = await request(app).get("/healthz");
    expect(response.statusCode).toBe(200);
  });
});