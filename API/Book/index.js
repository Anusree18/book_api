//initializing express router
const Router = require("express"). Router();

//database models
const BookModel = require("../../database/book");

/*Route        : /  
Description    : to get all books
Access         :PUBLIC
Parameter      :NONE
Methods        :GET
*/
Router.get("/",async(req,res) => {
    try{
        const getAllBooks = await BookModel.find();
    return res.json({books: getAllBooks});
    }catch(error){
        return res.json({error: error.message});}
});

/*Route        : /is  
Description    : to get specific books based on ISBN
Access         :PUBLIC
Parameter      :isbn
Methods        :GET
*/
Router.get("/is/:isbn", async (req,res) => {
    try{const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    if (!getSpecificBook){
        return res.json(
        {error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({book: getSpecificBook });
    }catch(error){
        return res.json({error: error.message});}
});

/*Route        : /c
Description    :to get specific books based on category
Access         :PUBLIC
Parameter      :category
Methods        :GET
*/
Router.get("/c/:category",async (req,res) =>{
    try{const getSpecificBook = await BookModel.findOne({
        category: req.params.category});
    if(!getSpecificBook){
        return res.json
        ({error:`No book found for the category ${req.params.category}`,
        });
    }
    return res.json({book: getSpecificBook});
    }catch(error){
        return res.json({error: error.message});
    }
});

/*Route        : /l
Description    :to get specific books based on language
Access         :PUBLIC
Parameter      :language
Methods        :GET
*/
Router.get("/l/:language",async(req,res) =>{
    try{const getSpecificBook = await BookModel.findOne({
        language: req.params.language});
    if(!getSpecificBook){
        return res.json(
            {error: `No book found for the language ${req.params.language}`,
            });
    }
    return res.json({book: getSpecificBook});
    }catch(error){
    return res.json({error: error.message});
    }
});

/*Route        : /book/add
Description    :Add new book
Access         :PUBLIC
Parameter      :NONE
Methods        :POST
*/
Router.post("/add", async (req, res) => {
   try{
    const { newBook } = req.body;

    await BookModel.create(newBook);
    
    return res.json({message:"book was added"});  
   }catch(error){
       return res.json({error: error.message});
   }
});

/*Route        : /book/update/title
Description    :Update book title
Access         :PUBLIC
Parameter      :isbn
Methods        :PUT
*/
Router.put("/update/title/:isbn", async (req,res)=> {
    try{const updatedBook = await BookModel.findOneAndUpdate(
        {
         ISBN: req.params.isbn,
         },
        {
             title: req.body.bookTitle,
        },
        {
            new: true,
        });
     return res.json({books: updatedBook});
    }catch(error){
        return res.json({error: error.message});
    }
 });
 
 /*Route        : /book/update/author
 Description    :update/add new author for a book
 Access         :PUBLIC
 Parameter      :isbn
 Methods        :PUT
 */
 Router.put("/update/author/:isbn/:authorId",async(req, res) =>{
     //update book database
     try{const updatedBook = await BookModel.findOneAndUpdate(
         {   
             ISBN: req.params.isbn
         },
         {
             $addToSet:{
                 author: req.body.newAuthor
             }
         },
         {
             new: true
         });
        
     
     //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
         {
             id: req.body.newAuthor
         },
         {
             $push: {
                 books: req.params.isbn
             }
         },
         {
             new: true
         });
         return res.json({
             books: updatedBook,
             authors: updatedAuthor,
             message: "new author was added",
         });
        }catch(error){
            return res.json({error: error.message});
        }
     });

/*Route        : /book/delete
Description    :delete a book
Access         :PUBLIC
Parameter      :isbn
Methods        :DELETE
*/
Router.delete("/delete/:isbn", async(req, res) =>{
    try{const updatedBookDatabase = await BookModel.findOneAndDelete(
        {ISBN : req.params.isbn});
    return res.json({books: updatedBookDatabase});
    }catch(error){
        return res.json({error: error.message});
    }
});

/*Route        : /book/delete/author
Description    :delete an author from a book
Access         :PUBLIC
Parameter      :isbn,authorId
Methods        :DELETE
*/
Router.delete("/delete/author/:isbn/:authorId",async(req, res)=>{
    //update book database
    try{const updatedBook = await BookModel.findOneAndUpdate(
    {
        ISBN: req.params.isbn
    },
    {
        $pull:{
            authors: parseInt(req.params.authorId)
        }
    },
    {
        new: true
    });


    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId)
        },
        {
            $pull:{
                books: req.params.isbn
            }
        },
        {
            new: true
        });
    return res.json({book: updatedBook, author: updatedAuthor});
    }catch(error){
        return res.json({error: error.message});
    }
});
module.exports = Router;