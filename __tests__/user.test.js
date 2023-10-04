import request from 'supertest';
import app from '../server.js';
import { expect } from 'chai';
import config from '../app/config/dbConfig.js';

describe("GET /v1/healthz", () => {
  console.log(config.database.dialect);
  console.log(config.database.user);
  console.log(config.database.pd);
  console.log(config.database.user);
  console.log(config.database.port);
  console.log(config.database.database);
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
