import request from 'supertest';
import app from '../server.js';
import { expect } from 'chai';

describe("GET /v1/healthz", () => {
  it("It should respond 200", async () => {
    const response = await request(app).get("/v1/healthz");
    console.log("Response:", response.body); // Log the response body
    console.log("Status Code:", response.statusCode); // Log the status code
    expect(response.statusCode).equal(200);
  });
});
