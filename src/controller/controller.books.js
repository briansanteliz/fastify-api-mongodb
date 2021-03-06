const Book = require("../models/books");
const boom = require("boom");

module.exports = {
  getBooks: async (req, reply) => {
    try {
      const books = await Book.find();
      return reply.code(200).send(books);
    } catch (error) {
      throw boom.boomify(error);
    }
  },
  getBook: async (req, reply) => {
    const { id } = req.params;
    try {
      const book = await Book.findOne({ _id: id });
      return book
        ? reply.code(200).send(book)
        : reply.code(404).send({ msg: "Book not found" });
    } catch (error) {
      throw boom.boomify(error);
    }
  },
  deleteBook: async (req, reply) => {
    const { id } = req.params;
    try {
      const book = await Book.findOne({ _id: id });
      if (!book) return reply.code(404).send({ msg: "Book not found" });
      await book.remove();
      return reply.code(200).send({ msg: "Book deleted" });
    } catch (error) {
      throw boom.boomify(error);
    }
  },
  createBook: async (req, reply) => {
    try {
      const { title, img, isbn, description } = req.body;
      if (title && img && isbn && description) {
        const newBook = new Book({
          ...req.body,
        });
        await newBook.save();
        return reply.code(201).send(newBook);
      }
      return reply.code(400).send({
        msg: "All field is required",
      });
    } catch (error) {
      throw boom.boomify(error);
    }
  },
  updateBook: async (req, reply) => {
    const { id } = req.params;
    if (!id) return reply.code(404).send({ msg: "Book id is required" });
    const { title, description, img, isbn } = req.body;
    if (!title || !description || !img || !isbn)
      return reply.code(400).send({ msg: "All field is required" });
    try {
      const bookToUpdate = {
        ...req.body,
      };
      const bookUpdated = await Book.findByIdAndUpdate(id, bookToUpdate, {
        new: true,
      });
      return bookUpdated
        ? reply.code(200).send({ msg: "Update!", book: bookUpdated })
        : reply.code(400).send({ msg: "Book not update" });
    } catch (error) {
      throw boom.boomifcy(error);
    }
  },
};
