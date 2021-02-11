const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { books });
}));

router.get('/new', asyncHandler(async (req, res) => {
    res.render('new-book', {prop: 'Hello I am a new book!'});
}));

module.exports = router;