const mongoose = require("mongoose");

//creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
      type: String,
      required: true,
      minLength:8,
      maxLength:10,
    },
      title:  {
        type: String,
        required: true,
        minLength:8,
        maxLength:10,
      },
      pubDate: {
        type: String,
        required: true,
        minLength:8,
        maxLength:10,
      },
      language: {
        type: String,
        required: true,
        minLength:8,
        maxLength:10,
      },
      numPage: {
        type: Number,
        required: true,
        minLength:8,
        maxLength:10,
      },
      author: [Number],
      publication: [Number],
      category: [String],
});

//create a book model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;