import request from 'supertest';
import app from '../app/app.js';
import { expect } from 'chai';

describe("GET /healthz ", () => {
  it("It should respond 200", async () => {
    const response = await request(app).get("/v1/healthz");
    expect(response.statusCode).equal(200);
  });
});