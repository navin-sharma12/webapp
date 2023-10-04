import request from 'supertest';
import app from '../server.js';
import { expect } from 'chai';

describe("GET /v1/healthz", () => {
  it("It should respond 200", (done) => { // Use the 'done' callback
    request(app)
      .get("/v1/healthz")
      .end((err, response) => {
        if (err) {
          done(err); // Pass the error to 'done'
        } else {
          expect(response.statusCode).equal(200);
          done(); // Indicate that the test is done
        }
      });
  });
});
