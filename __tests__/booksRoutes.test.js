const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");




beforeEach(async function () {
    await db.query("DELETE FROM books");
    let b1 = await Book.create({
        isbn: "0681161018",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew bane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
    });
});


/** GET / => {books: [...]}  */
describe("GET /books", function () {
    test("can get list of books", async function () {
        let response = await request(app)
            .get("/books");


        expect(response.body).toEqual({
            books: [{
                isbn: "0681161018",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew bane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
            }]
        });
    });
});

/** GET /[id]  => {book: book} */

describe("GET /books/:isbn", function () {
    test("can get book", async function () {
        let response = await request(app)
            .get("/books/0681161018");

        expect(response.body).toEqual({
            book: {
                isbn: "0681161018",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew bane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
            }
        });
    });

    test("404 on missing book", async function () {
        let response = await request(app)
            .get("/books/wrong");

        expect(response.statusCode).toEqual(404);
    });
});



/** POST /   bookData => {book: newBook}  */
describe("POST /books/", function () {
    test("can post book", async function () {
        let testBook = {
            isbn: "000",
            amazon_url: "http://a.co/eobPtX2",
            author: "Phoenix",
            language: "english",
            pages: 2,
            publisher: "Self",
            title: "Almost Time for Lunch",
            year: 2023
        };
        let response = await request(app)
            .post("/books")
            .send(testBook);
        expect(response.statusCode).toBe(201);
        expect(response.body.book).toEqual(testBook);
    })
    test("cannot post invalid book", async function () {
        //this book has 8 validation errors
        let badBook = {
            isbn: 0,
            amazon_url: 0,
            author: 0,
            language: 0,
            pages: "2",
            publisher: 0,
            title: 0
        };
        let response = await request(app)
            .post("/books")
            .send(badBook);
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message.length).toEqual(8);
    })

});


/** PUT /[isbn]   bookData => {book: updatedBook}  */
describe("PUT /books/:isbn", function () {
    test("can update book", async function () {
        let updateBook = {
            isbn: "0681161018",
            amazon_url: "http://a.co/eobPtX2",
            author: "",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
        };
        let response = await request(app)
            .put("/books/0681161018")
            .send(updateBook);

        expect(response.statusCode).toBe(200);
        expect(response.body.book).toEqual(updateBook);
    })
    test("cannot update book with invalid fields", async function () {
        let updateBook = {
            isbn: "0681161018",
            amazon_url: "http://a.co/eobPtX2",
            author: "",
            language: "english",
            pages: "264",
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
        };
        let response = await request(app)
            .put("/books/0681161018")
            .send(updateBook);

        expect(response.statusCode).toBe(400);
        expect(response.body.error.message.length).toEqual(1);
    })
});


/** DELETE /[isbn]   => {message: "Book deleted"} */
describe("DELETE /books/:isbn", function () {
    test("can delete book", async function () {
        let response = await request(app).delete("/books/0681161018");
        expect(response.body.message).toEqual("Book deleted");
    })
});



afterAll(async function () {
    await db.end();
});
