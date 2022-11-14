const  request  = require("supertest");
const app = require('../app.js');
const db = require('../db/connection.js');
const seed  =require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

beforeAll(() => {
    return seed(testData);
})

afterAll(() => {
    return db.end();
})

describe("GET", () => {
    test.only("topics- return status 200 with an object with all topics", () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toHaveLength(3)
      })
     
    });

    test.only("topics- return status 404 when wrong url", () => {
        return request(app)
        .get('/api/topic')
        .expect(404)
        
       
      });
})