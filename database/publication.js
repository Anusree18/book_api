const mongoose = require("mongoose");

// create publication schema
const PublicationSchema = mongoose.Schema({
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

//create publication model
const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;