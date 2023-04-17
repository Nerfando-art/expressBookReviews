const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  // check if the username is valid (in this example, we are assuming any non-empty string is valid)
  return !!username.trim();
}

const authenticatedUser = (username,password)=>{ 
  // check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  return res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username } = decoded;
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.reviews.push({ username, review });
    return res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username } = decoded;
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.reviews = book.reviews.filter(review => review.username !== username);
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
