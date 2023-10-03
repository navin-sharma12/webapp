import request from 'supertest';
import app from '../server.js';
import { expect } from 'chai';

describe("GET /v1/healthz", () => {
  it("It should respond 200", (done) => { // Add done callback here
    request(app)
      .get("/v1/healthz")
      .end((err, response) => { // Use end method to handle the response
        if (err) return done(err); // If there's an error, pass it to done
        expect(response.statusCode).equal(200);
        done(); // Call done to signal that the test is complete
      });
  });
});
