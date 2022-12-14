const  request  = require("supertest");
const app = require('../app.js');
const db = require('../db/connection.js');
const seed  =require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');


beforeAll(() => {
    return seed(testData);
})

afterAll(() => {
   if(db) return db.end();
})

describe("GET", () => {
    test("endpoints - responds with the JSON file of all possible endpoints from the api", () => {
       return request(app)
      .get('/api')
      .then((res) => {
        expect(res.body).toMatchObject(
            expect.objectContaining({
                "GET /api": {
                    "description": "serves up a json representation of all the available endpoints of the api"
                  }
            })
        )
      })
    })
    
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
     
      test("users- return status 200 with an object with all users", () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((res) => {
          expect(res.body.users).toHaveLength(4);
          const users  = res.body.users;
            expect(users).toBeInstanceOf(Array);
            users.forEach((user) => {
              expect(user).toEqual(
                  expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
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
                    comments_count: expect.any(String),
                }),
            );
          })
        })
        })
        test("articles- return status 200 with an array of sorted ASC articles", () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSorted({descending:false});
            })
        })
        test("articles- return status 200 with an array of articles that are filtered by topic", () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then((res) => {
                const articles  = res.body.articles;
                expect(articles).toBeInstanceOf(Array);
                articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id : expect.any(Number),
                        title: expect.any(String),
                        topic: 'cats',
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    }),
                );
              })

        });
            
        
        })
        test("articles- return status 200 with an array of articles ordered by author in descending order", () => {
            return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('author',{descending:true});
            })
        })
        test("articles- return status 200 with an array of articles ordered by votes in ascending order", () => {
            return request(app)
            .get('/api/articles?sort_by=votes&order=asc')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('votes',{descending:false});
            })
        })
        test("articles- return status 200 with an array of articles filtered by topic and return an empty array", () => {
            return request(app)
            .get('/api/articles?topic=paper&sort_by=votes&order=asc')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('votes',{descending:false});
                const articles  = res.body.articles;
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toEqual([]);
              })
        })
        test("articles- return status 400 and a message with invalid query", () => {
            return request(app)
            .get('/api/articles?sort_by=something&order=asc')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('invalid query');
              })
        })
        test("article- return status 200 with an object with the article with the requested id", () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
              const article  = res.body.article;
              const date = new Date(article.created_at)
              
              expect(article).toMatchObject(
                expect.objectContaining({
                    article_id : 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: date.toISOString(),
                    votes: 100,
                    
                })
              )
              
              
            })
        })

        test("article- return status 200 with an object with the article with the requested id and the new property of comments_count", () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
              const article  = res.body.article;
              const date = new Date(article.created_at)
              
              expect(article).toMatchObject(
                expect.objectContaining({
                    article_id : 1,
                    comments_count: '11',
                })
              )
              
              
            })
        })

        test("article- return status 404 with an an error message if the requested article  is not found", () => {
            return request(app)
            .get('/api/articles/25')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('article not found')
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

describe("DELETE", () => {
    test("comment - return status 204 with no content", () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204);
    })
    test("comment - return status 404 when comment doesnt exist", () => {
        return request(app)
            .delete('/api/comments/100')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('comment not found')
            })
    })
    test("comment - return status 400 when the request has the wrond datatype", () => {
        return request(app)
            .delete('/api/comments/invalid')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('invalid request for comment id')
            })
    })

})