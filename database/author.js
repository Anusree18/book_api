const mongoose = require("mongoose");

//author schema
const AuthorSchema =mongoose.Schema({
    id: {
        type: Number,
        required: true,
        minLength:8,
        maxLength:10,
      },
    name: {
        type: String,
        required: true,
        minLength:8,
        maxLength:10,
      },
     books: [String], 
});

//author model
const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;

