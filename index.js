// Import necessary modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Create an Express application
const app = express();
const port = 3000;

// Connect to PostgreSQL database
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Body parser middleware to parse incoming request bodies
app.use(express.static("public")); // Serve static files from the "public" directory

// Default sort order
let sort = "review_id";

// Route to handle requests to the root URL "/"
app.get("/", async (req, res) => {
    try {
        // Query the database to fetch books and their reviews, sorted by the specified column
        const response = await db.query(
          `SELECT * FROM books
            JOIN book_reviews ON books.book_id=book_reviews.book_id
            ORDER BY ${sort} ASC`
        );
        const data = response.rows; // Extract data from the response
        // Render the "index.ejs" template with the retrieved data
        res.render("index.ejs", {
            search: search, // Pass search term to the template
            data: data, // Pass book and review data to the template
        });

    } catch (error) {
        console.log("Could not execute query: ", error); // Log error if query execution fails
    }
});

// Route to handle requests to "/book"
app.get("/book", async (req, res) => {
    // Extract query parameters
    const bookTitle = req.query.title;
    const author = req.query.author;
    const coverId = req.query.coverId;
    try {
        // Query the database to fetch books and their reviews
        const response = await db.query(
          `SELECT * FROM books
        JOIN book_reviews ON books.book_id=book_reviews.book_id`
        );
        const data = response.rows; // Extract data from the response
        // Check if book title exists in the database with a review already
        const bookCheck = data.find((book) => book.title === req.query.title);
        // Check if review exists. If not, set review to undefined
        const review = bookCheck ? bookCheck.review_text : undefined;
        const book_id = bookCheck ? bookCheck.book_id : undefined;
        // Render the "addBook.ejs" template with relevant data
        res.render("addBook.ejs", {
            title: bookTitle,
            author: author,
            cover: coverId,
            review: review,
            book_id: book_id
        });
    } catch (error) {
        console.log("Error: ", error); // Log error if query execution fails
    }
});

// Route to handle sorting requests
app.post("/sort", async (req, res) => {
    sort = req.body.sort; // Update the sorting criteria based on the request body
    res.redirect("/"); // Redirect back to the homepage
});

// Route to handle updating reviews
app.post("/updateReview", async (req, res) => {
    // Extract data from the request body
    const review_text = req.body.review_text;
    const rating = req.body.rating;
    const book_id = req.body.bookId;
    const currentDate = new Date().toISOString();
    try {
        // Update the review in the database
        const response = await db.query(
          `UPDATE book_reviews
            SET review_text = $1, rating = $2, review_date = $3
            WHERE book_id = $4
            RETURNING *`, [review_text, rating, currentDate, book_id]
        );
        const data = response.rows; // Extract data from the response
        console.log(`${rating}, ${book_id}, ${currentDate}`); // Log some information
        res.redirect("/"); // Redirect back to the homepage
    } catch (error) {
        console.log("Error: ", error); // Log error if query execution fails
    }
});

// Route to handle adding a new book and review
app.post("/addBook", async (req, res) => {
    // Extract data from the request body
    const bookTitle = req.body.title;
    const coverId = req.body.cover_id;
    const author = req.body.author;
    const review_text = req.body.review_text;
    const rating = req.body.rating;

    try {
        // Begin a database transaction
        await db.query('BEGIN');
        // Insert a new book into the database
        const newBook = await db.query(
          `INSERT INTO books (title, author, cover_id)
            VALUES ($1, $2, $3)
            RETURNING book_id`, [bookTitle, author, coverId]
        );
        // Insert a new review into the database
        const newReview = await db.query(
          `INSERT INTO book_reviews (book_id, review_text, rating)
            VALUES ($1, $2, $3)
            RETURNING *`, [newBook.rows[0].book_id, review_text, rating]
        );
        // Commit the transaction if both inserts are successful
        await db.query('COMMIT');
        res.redirect("/"); // Redirect back to the homepage
    } catch (error) {
        // Rollback the transaction if an error occurs
        await db.query('ROLLBACK');
        console.log("An Error Occurred: ", error); // Log error message
    }
});

// Route to handle deletion of a book and its reviews
app.delete("/delete/:id", async (req, res) => {
    const bookId = req.params.id; // Extract book ID from request parameters
    try {
        // Begin a database transaction
        await db.query('BEGIN');
        // Delete reviews associated with the book
        await db.query(
          `DELETE FROM book_reviews
            WHERE book_id = $1`, [bookId]
        );
        // Delete the book itself
        await db.query(
          `DELETE FROM books
            WHERE book_id = $1`, [bookId]
        );
        // Commit the transaction
        await db.query('COMMIT');
    } catch (error) {
        // Rollback the transaction if an error occurs
        await db.query('ROLLBACK');
        console.log("An error occurred: ", error); // Log error message
    }
    res.sendStatus(200); // Send a success status response
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Log a message indicating that the server is running
});


