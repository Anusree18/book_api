require("dotenv").config();

//frame work
const express = require("express");
const mongoose = require("mongoose");

//initializing express
const booky = express();

//microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

//configuration
booky.use(express.json());

//establish database connection
mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=> console.log("connection established!"));

//initializing microservices
booky.use("/book",Books);
booky.use("/author",Authors);
booky.use("/publication",Publications);

booky.listen(3000, () => console.log("Server is running"));