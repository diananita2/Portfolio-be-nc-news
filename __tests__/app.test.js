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

      test.only("articles- return status 200 with an object with all articles", () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
          const articles  = res.body.articles;
          expect(articles).toBeInstanceOf(Array);
          articles.forEach((article) => {
            
            expect(article).toEqual(
                expect.objectContaining({
                    article_id : expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                }),
            );
          })
        })
       
      });
  
      test.only("articles- return status 404 when wrong url", () => {
          return request(app)
          .get('/api/article')
          .expect(404)
        });
})