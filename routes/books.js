const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            next(error);
        }
    }
}


//505 test error located at localhost:port/books/error
router.get('/error', (req, res, next) => {
    const error = new Error();
    error.status = 500;
    error.message = 'Custom 500 error';
    throw error;
});


//GET homepage
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { title: 'Books', books });
}));

//GET new book form
router.get('/new', asyncHandler(async (req, res) => {
    res.render('new-book', { title: 'New Book', book: {} });
}));

//POST new book to db
router.post('/', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            res.render('new-book', { book, errors: error.errors, title: 'New Book' })
        } else {
            throw error;
        }
    }
}));

//GET individual book update form
router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', { book, title: book.title });
    } else {
        const err = new Error();
        err.status = 404;
        err.message = 'Sorry, this book does not exist.'
        throw err;
    }
}));

//POST update individual book
router.post('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.redirect('/');
    }
}));

//POST delete individual book
router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;