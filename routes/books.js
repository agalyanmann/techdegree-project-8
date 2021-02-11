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
    res.render('index', { title: 'Books', books });
}));

router.get('/new', asyncHandler(async (req, res) => {
    res.render('new-book', { title: 'New Book', book: {} });
})); 

router.post('/', asyncHandler(async (req, res) =>{
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books/' + book.id);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            res.render('/new', { book, errors: error.errors, title: 'New Book'})
        } else {
            throw error;
        }
    }
}));

module.exports = router;