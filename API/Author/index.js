
const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/*Route        : /author
Description    :to get all author
Access         :PUBLIC
Parameter      :NONE
Methods        :GET
*/

Router.get("/",async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
     return res.json({authors: getAllAuthors});
});


/*Route        : /author/id
Description    :to get specific authors based on id
Access         :PUBLIC
Parameter      :id
Methods        :GET
*/
Router.get("/id/:id",async (req,res) =>{
    const getSpecificAuthor = await AuthorModel.findOne({
        id: req.params.id
    });
    if(!getSpecificAuthor) {
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
Router.get("/book/:isbn", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.find({books: {$in: req.params.isbn}});

    if(!getSpecificAuthor){
        return res.json(
        {error: `No author found for the book of ${req.params.isbn}`});
    }
    return res.json({authors: getSpecificAuthor});
});

/*Route        : /author/add
Description    :Add new author
Access         :PUBLIC
Parameter      :NONE
Methods        :POST
*/
Router.post("/add", async(req,res) => {
    const { newAuthor } = req.body;
    AuthorModel.create(newAuthor);
    return res.json({message: "author was added"});
}); 

/*Route        : /author/update/name
Description    :Update Author name using it's id 
Access         :PUBLIC
Parameter      :ID
Methods        :PUT
*/
Router.put("/update/name/:ID",async(req,res) =>{
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.ID)
        },
        {
            name: req.body.newAuthorName
        },
        {
            new: true
     });
     return res.json({authors: updatedAuthor});
 });
 /*Route        : /author/delete
Description    :Delete an author
Access         :PUBLIC
Parameter      :authorId
Methods        :DELETE
*/
Router.delete("/delete/:authorId", async(req, res) =>{
    const updatedAuthor = await AuthorModel.findOneAndDelete({id:  parseInt(req.params.authorId)});
    return res.json({authors: updatedAuthor});
});
 
module.exports = Router;