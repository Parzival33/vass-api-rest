let server = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe("Server APIs", () => {
  describe("Test Get", () => {
    it("It should return all tasks", done => {
      //const taskId = 1;
      chai.request(server).get("/clients").end((err, response) => {
        response.should.be.a("array");
        done();
      });
    });
  });
});
