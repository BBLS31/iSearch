const request = require("supertest");
// Import the expect function from Chai for making assertions in tests
const expect = require("chai").expect;
const app = require("./server");

// Describe a test suite for the GET /favorites route
describe("GET /favorites", () => {
  // Define a test case that checks if the route responds with JSON
  it("responds with json", async () => {
    // Make a GET request to the /favorites route using supertest
    // and store the response in the res variable
    const res = await request(app)
      .get("/favorites") // Specify the route
      .expect("Content-Type", /json/) // Expect the Content-Type header to match /json/
      .expect(200); // Expect the status code to be 200
  });
});
