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
    test("topics- return status 200 with an object with all topics", () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toHaveLength(3);
        const topics  = res.body.topics;
          expect(topics).toBeInstanceOf(Array);
          topics.forEach((topic) => {
            expect(topic).toEqual(
                expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String),
                })
            )
          })
        })
      })
     
    

      test("articles- return status 200 with an object with all articles", () => {
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
        })
        
        test("article- return status 200 with an object with the article with the requested id", () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
              const article  = res.body.article;
              const date = new Date(article.created_at)
              
              expect(article).toEqual({
                article_id : 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: date.toISOString(),
                votes: 100,
              })
              
            })
        })

        test("article- return status 404 with an an error message if the requested article  is not found", () => {
            return request(app)
            .get('/api/articles/25')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('invalid request for article id')
            
            })
        })

        test("article- return status 400 with an an error message if the datatype of id in url is not valid", () => {
            return request(app)
            .get('/api/articles/invalid')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('invalid request for article id')
            
            })
        })
        test("comments- return status 200 with an array of comments of the article with the specified id", () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then((res) => {
                expect(res.body.comments).toHaveLength(11);
                const comments = res.body.comments;
                expect(comments).toBeInstanceOf(Array);
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id : expect.any(Number),
                        article_id : 1,
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                    }),
                    );
                })
                })
        })

        test("comments- return status 200 with an empty array if the article does not have comments", () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then((res) => {
                    expect(res.body.comments).toEqual([])
                })
        })

        test("comments- return status 400 with an an error message if the datatype of id in url is not valid", () => {
            return request(app)
                .get('/api/articles/invalid/comments')
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe('invalid request for article id')
                })
        })

        test("comments- return status 404 with an an error message if the id does not exist", () => {
            return request(app)
                .get('/api/articles/50/comments')
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe('article not found')
                })
        })
});

describe("POST", () => {
    test("comments- return status 201 with the object that has been posted", () => {
        const newComment = {
            username:'icellusedkars',
            body: 'Not a good article'
        }
        return request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(201)
            .then((res) => {
                expect(res.body.comment).toMatchObject({
                    comment_id :19,
                    article_id: 2,
                    created_at : expect.any(String),
                    author : 'icellusedkars',
                    body: 'Not a good article'

                })
            })
    })

    test("comments- return status 404 with an an error message if the id does not exist", () => {
        const newComment = {
            username:'icellusedkars',
            body: 'Not a good article'
        }
        return request(app)
            .post('/api/articles/50/comments')
            .send(newComment)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('article not found')
            })
    })

    test("comments- return status 400 with an an error message if the id is not valid", () => {
        const newComment = {
            username:'icellusedkars',
            body: 'Not a good article'
        }
        return request(app)
            .post('/api/articles/invalid/comments')
            .send(newComment)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('invalid request for article id')
            })
    })
})

describe("PATCH", () => {
    test("articles- return status 200 with the updated object", () => {
        const articleUpdates = {
            inc_votes: 2
        }
        return request(app)
            .patch('/api/articles/1')
            .send(articleUpdates)
            .expect(200)
            .then((res) => {
                expect(res.body.article).toEqual({
                    article_id:1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 102,
                })
            })
    })

    test("articles- return status 400 with an an error message if the id is not valid", () => {
        const articleUpdates = {
            inc_votes: 2
        }
        return request(app)
            .patch('/api/articles/invalid')
            .send(articleUpdates)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('invalid request for article id')
            })
    })

    test("articles- return status 404 with an an error message if the id is not found", () => {
        const articleUpdates = {
            inc_votes: 2
        }
        return request(app)
            .patch('/api/articles/100')
            .send(articleUpdates)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('article not found')
            })
    })
    test("articles- return status 400 with an an error message if the votes datatype is not valid", () => {
        const articleUpdates = {
            inc_votes: 'bad'
        }
        return request(app)
            .patch('/api/articles/1')
            .send(articleUpdates)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('invalid datatype')
            })
    })
})