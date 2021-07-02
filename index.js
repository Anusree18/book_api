require("dotenv").config();

//frame work
const express = require("express");
const mongoose = require("mongoose");

//initializing express
const booky = express();

//database
const database = require("./database/database");

//configuration
booky.use(express.json());

//establish database connection
mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=> console.log("connection established!"));



/*Route        : /  
Description    : to get all books
Access         :PUBLIC
Parameter      :NONE
Methods        :GET
*/
booky.get("/",(request,response) => {
    return response.json({books: database.books});
});

/*Route        : /is  
Description    : to get specific books based on ISBN
Access         :PUBLIC
Parameter      :isbn
Methods        :GET
*/
booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn);
    if (getSpecificBook.length === 0){
        return res.json(
            {error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({book: getSpecificBook });
});

/*Route        : /c
Description    :to get specific books based on category
Access         :PUBLIC
Parameter      :category
Methods        :GET
*/
booky.get("/c/:category",(req,res) =>{
    const getSpecificBook = database.books.filter((book) => 
        book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0){
        return res.json
        ({error:`No book found for the category ${req.params.category}`,
        });
    }
    return res.json({book: getSpecificBook});
});

/*Route        : /l
Description    :to get specific books based on language
Access         :PUBLIC
Parameter      :language
Methods        :GET
*/

booky.get("/l/:language",(req,res) =>{
    const getSpecificBook = database.books.filter((book) =>
    book.language.includes(req.params.language)
    );
    if(getSpecificBook.length===0){
        return res.json(
            {error: `No book found for the language ${req.params.language}`,
            });
    }
    return res.json({book: getSpecificBook});
});


/*Route        : /author
Description    :to get all author
Access         :PUBLIC
Parameter      :NONE
Methods        :GET
*/

booky.get("/author",(req, res) =>{
     return res.json({authors: database.authors});
});


/*Route        : /author/id
Description    :to get specific authors based on id
Access         :PUBLIC
Parameter      :id
Methods        :GET
*/
booky.get("/author/id/:id",(req,res) =>{
    const getSpecificAuthor = database.authors.filter(
        (author) => author.id === parseInt(req.params.id));
    if(getSpecificAuthor.length===0) {
        return res.json(
            {error: `No author found for the id ${req.params.id}`,
        });
    }
    return res.json({authors: getSpecificAuthor},);
});

/*Route        : /author/book
Description    :to get specific authors based on books
Access         :PUBLIC
Parameter      :isbn
Methods        :GET
*/
booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0){
        return res.json(
        {error: `No author found for the book of ${req.params.isbn}`,});
    }
    return res.json({authors: getSpecificAuthor});
});

/*Route        : /publications
Description    :to get all publications
Access         :PUBLIC
Parameter      :NONE
Methods        :GET
*/
booky.get("/publications",(req,res) =>{
    return res.json({publications: database.publications},);
});


/*Route        : /publications/id
Description    :to get specific publications based on id
Access         :PUBLIC
Parameter      :id
Methods        :GET
*/
booky.get("/publications/id/:id",(req,res) =>{
    const getSpecificPlublication = database.publications.filter(
        (publication) => publication.id === parseInt(req.params.id));
    if(getSpecificPlublication.length === 0){
        return res.json({error: `No publication found for the id ${req.params.id}`,});
    }
    return res.json({publications: getSpecificPlublication},);
});
/*Route        : /publications/id
Description    :to get specific publications based on book 
Access         :PUBLIC
Parameter      :isbn
Methods        :GET
*/
booky.get("/publications/book/:isbn", (req,res) => {
    const getSpecificPlublication = database.publications.filter((publication) =>
    publication.books.includes(req.params.isbn)
    );
    if(getSpecificPlublication.length === 0){
        return res.json(
        {error: `No publication found for the book of ${req.params.isbn}`,});
    }
    return res.json({publications: getSpecificPlublication});
});

/*Route        : /book/add
Description    :Add new book
Access         :PUBLIC
Parameter      :NONE
Methods        :POST
*/
booky.post("/book/add", (req, res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({books: database.books});   
});

/*Route        : /author/add
Description    :Add new author
Access         :PUBLIC
Parameter      :NONE
Methods        :POST
*/
booky.post("/author/add",(req,res) =>{
    const { newAuthor } = req.body;
    database.authors.push(newAuthor);
    return res.json({authors: database.authors});
});

/*Route        : /publication/add
Description    :Add new publcation
Access         :PUBLIC
Parameter      :NONE
Methods        :POST
*/
booky.post("/publication/add", (req,res) =>{
    const { newPublication } = req.body;
    database.publications.push(newPublication);
    return res.json({publication: database.publications});
});

/*Route        : /book/update/title
Description    :Update book title
Access         :PUBLIC
Parameter      :isbn
Methods        :PUT
*/
booky.put("/book/update/title/:isbn", (req,res)=> {
    database.books.forEach((book) =>{
        if(book.ISBN===req.params.isbn){
            book.title = req.body.newBookTitle;
            return;
        }
    });
    return res.json({books: database.books},);
});

/*Route        : /book/update/author
Description    :update/add new author for a book
Access         :PUBLIC
Parameter      :isbn
Methods        :PUT
*/
booky.put("/book/update/author/:isbn/:authorId",(req, res) =>{
    //update book database
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn) 
            return book.author.push(parseInt(req.params.authorId));
    });
    //update author database
    database.authors.forEach((author) =>{
        if(author.id === parseInt(req.params.authorId))
            return author.books.push(req.params.isbn);
    });
    return res.json({books: database.books, authors: database.authors});
});

/*Route        : /author/update/name
Description    :Update Author name using it's id 
Access         :PUBLIC
Parameter      :ID
Methods        :PUT
*/
booky.put("/author/update/name/:ID",(req,res) =>{
    database.authors.forEach((author) => {
        if(author.id=== parseInt(req.params.ID))
            author.name = req.body.newAuthorName;
    });
    return res.json({authors: database.authors});
});

/*Route        : /publication/update/name
Description    :Update the publication name using it's id
Access         :PUBLIC
Parameter      :ID
Methods        :PUT
*/
booky.put("/publication/update/name/:ID",(req,res) =>{
    database.publications.forEach((publication) =>{
        if(publication.id === parseInt(req.params.ID))
            publication.name = req.body.newPublicationName;
    });
    return res.json({publications: database.publications});
});

/*Route        : /publication/update/book
Description    :update/add new book to a publication,assume a book can have just one publication
Access         :PUBLIC
Parameter      :isbn
Methods        :PUT
*/
booky.put("/publication/update/book/:isbn", (req,res)=>{
    //update the publication database
    database.publications.forEach((publication) =>{
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
                book.publication =req.body.pubId;
                return;
        }
    });
    return res.json({books: database.books, publications: database.publications});
});

/*Route        : /book/delete
Description    :delete a book
Access         :PUBLIC
Parameter      :isbn
Methods        :DELETE
*/
booky.delete("/book/delete/:isbn", (req, res) =>{
    const updatedBookDatabase = database.books.filter(
        (book) => (book.ISBN !== req.params.isbn)
    );
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});

/*Route        : /book/delete/author
Description    :delete an author from a book
Access         :PUBLIC
Parameter      :isbn,authorId
Methods        :DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId",(req, res)=>{
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
                (author) => author !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    });
    //update author database
    database.authors.forEach((author) =>{
    if(author.id === parseInt(req.params.authorId)) {
        const newBooksList = author.books.filter(
            (book) => book !== req.params.isbn);
        author.books= newBooksList;
        return;
    }

    });
    return res.json({book: database.books, author: database.authors});
});

/*Route        : /author/delete
Description    :Delete an author
Access         :PUBLIC
Parameter      :authorId
Methods        :DELETE
*/
booky.delete("/author/delete/:authorId", (req, res) =>{
    const updatedAuthorDatabase = database.authors.filter(
        (author) => (author.id !== parseInt(req.params.authorId))
    );
    database.authors = updatedAuthorDatabase;
    return res.json({authors: database.authors});
});

/*Route        : /publication/delete
Description    :Delete an publication
Access         :PUBLIC
Parameter      :pubId
Methods        :DELETE
*/
booky.delete("/publication/delete/:pubId",(req,res)=>{
    const updatedPublicationList = database.publications.filter(
        (publication)=> (publication.id !== parseInt(req.params.pubId)));
        database.publications = updatedPublicationList;
        return res.json({publication: database.publications})
});

/*Route        : /publication/delete/book
Description    :Delete a book from publication.
Access         :PUBLIC
Parameter      :pubId,isbn
Methods        :DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{
    //update the publication database
    database.publications.forEach((publication)=>{
        if (publication.id === parseInt(req.params.pubId)){
        const newBooksList = publication.books.filter(
            (book) => book !== req.params.isbn);
            publication.books = newBooksList;
            return;
    } 
    });
    //update book database
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            book.publication =0; //no publication avaliable
            return;
        }
    });
    return res.json({books: database.books, publications: database.publications});
});

booky.listen(3000, () => console.log("Server is running"));