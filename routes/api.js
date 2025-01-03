'use strict';

export default function (app, Book) {
  // Route to handle all books
  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await Book.find({}, 'title comments');
        const response = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        }));
        res.json(response);
      } catch (err) {
        res.status(500).send('Error fetching books');
      }
    })
    .post(async (req, res) => {
      const title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      try {
        const newBook = await Book.create({ title });
        res.json({ _id: newBook._id, title: newBook.title });
      } catch (err) {
        res.status(500).send('Error adding book');
      }
    })
    .delete(async (req, res) => {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Error deleting all books');
      }
    });

  // Routes to handle individual books
  app.route('/api/books/:id')
    .get(async (req, res) => {
      const bookId = req.params.id;
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          return res.send('no book exists');
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
        });
      } catch (err) {
        res.status(500).send('Error fetching book');
      }
    })
    .post(async (req, res) => {
      const bookId = req.params.id;
      const comment = req.body.comment;
      if (!comment) {
        return res.send('missing required field comment');
      }
      try {
        const book = await Book.findById(bookId);
        if (!book) {
          return res.send('no book exists');
        }
        book.comments.push(comment);
        const updatedBook = await book.save();
        res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments,
        });
      } catch (err) {
        res.status(500).send('Error adding comment');
      }
    })
    .delete(async (req, res) => {
      const bookId = req.params.id;
      try {
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (err) {
        res.status(500).send('Error deleting book');
      }
    });

  // Error handling middleware
  app.use((err, req, res, next) => {
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  });
}
