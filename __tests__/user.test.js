import request from 'supertest';
import app from '../server.js';
import { expect } from 'chai';

describe("GET /v1/healthz", () => {
  it("should respond 200", (done) => {
    request(app)
      .get("/v1/healthz")
      .end((err, response) => {
        if (err) {
          done(err); // Call done with an error if there is one
        } else {
          console.log("Response:", response.body);
          console.log("Status Code:", response.statusCode);
          expect(response.statusCode).equal(200);
          done(); // Call done without an error to indicate success
        }
      });
  });
});
