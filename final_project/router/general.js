const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  books.users.push({ username, password });
  return res.status(200).json({ message: "user successfully registered" });
});


public_users.get('/', async function(req, res) {
  try {
    const response = await axios.get('https://api.example.com/books');
    const books = response.data;
    res.send(JSON.stringify(books, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while getting the books.');
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`https://some-api.com/books/isbn/${isbn}`);
    const book = response.data;
    return res.status(200).json({ book });
  } catch (error) {
    return res.status(404).json({ message: "book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(`https://some-api.com/books/author/${author}`);
    const authorBooks = response.data;
    if (authorBooks.length === 0) {
      return res.status(404).json({ message: "No books found for author" });
    }
    return res.status(200).json({ books: authorBooks });
  } catch (error) {
    return res.status(404).json({ message: "No books found for author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(`https://some-api.com/books/title/${title}`);
    const titleBooks = response.data;
    if (titleBooks.length === 0) {
      return res.status(404).json({ message: "No books found with title" });
    }
    return res.statusMessage(200).json({ books: titleBooks });
  } catch (error) {
    return res.status(404).json({ message: "No books found with title" });
  }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`https://some-api.com/books/review/${isbn}`);
    const book = response.data;
    const { reviews } = book;
    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(404).json({ message: "No book review found" });
  }
});

module.exports.general = public_users;