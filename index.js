const express = require("express");

const booky = express();

const database = require("./database");

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
     return res.json({authors: database.author});
});


/*Route        : /author/id
Description    :to get specific authors based on id
Access         :PUBLIC
Parameter      :id
Methods        :GET
*/
booky.get("/author/id/:id",(req,res) =>{
    const getSpecificAuthor = database.author.filter(
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
    const getSpecificAuthor = database.author.filter((author) =>
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
    return res.json({publications: database.publication},);
});


/*Route        : /publications/id
Description    :to get specific publications based on id
Access         :PUBLIC
Parameter      :id
Methods        :GET
*/
booky.get("/publications/id/:id",(req,res) =>{
    const getSpecificPlublication = database.publication.filter(
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
    const getSpecificPlublication = database.publication.filter((publication) =>
    publication.books.includes(req.params.isbn)
    );
    if(getSpecificPlublication.length === 0){
        return res.json(
        {error: `No publication found for the book of ${req.params.isbn}`,});
    }
    return res.json({publications: getSpecificPlublication});
});
booky.listen(3000, () => console.log("Server is running"));