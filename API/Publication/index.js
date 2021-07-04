const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/*Route        : /publications
Description    :to get all publications
Access         :PUBLIC
Parameter      :NONE
Methods        :GET
*/
Router.get("/",async (req,res) =>{
    try{const getAllPublications = await PublicationModel.find();
    return res.json({publications: getAllPublications});
    }catch(error){
        return res.json({error: error.message});
    }
});


/*Route        : /publications/id
Description    :to get specific publications based on id
Access         :PUBLIC
Parameter      :id
Methods        :GET
*/
Router.get("/id/:id",async(req,res) =>{
    try{const getSpecificPlublication = await PublicationModel.findOne({
        id: req.params.id  });
    if(!getSpecificPlublication){
        return res.json({error: `No publication found for the id ${req.params.id}`,});
    }
    return res.json({publications: getSpecificPlublication},);
}catch(error){
    return res.json({error: error.message});
}
});

/*Route        : /publications/id
Description    :to get specific publications based on book 
Access         :PUBLIC
Parameter      :isbn
Methods        :GET
*/
Router.get("/book/:isbn", async (req,res) => {
    try{const getSpecificPlublication = await PublicationModel.find({books:{$in: req.params.isbn}});

    if(!getSpecificPlublication){
        return res.json(
        {error: `No publication found for the book of ${req.params.isbn}`});
    }
    return res.json(getSpecificPlublication);
}catch(error){
    return res.json({error: error.message});
}
});

/*Route        : /publication/update/name
Description    :Update the publication name using it's id
Access         :PUBLIC
Parameter      :ID
Methods        :PUT
*/
Router.put("/update/name/:ID",async(req,res) =>{
    try{const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.ID)
        },
        {
            name: req.body.newPublicationName
        },
        {
            new: true
        });
    return res.json({publications: updatedPublication});
    }catch(error){
        return res.json({error: error.message});
    }
});

/*Route        : /publication/add
Description    :Add new publcation
Access         :PUBLIC
Parameter      :NONE
Methods        :POST
*/
Router.post("/add",async(req,res) =>{
    try{const {newPublication} = req.body;
    PublicationModel.create(newPublication);
    return res.json({message: "Publiction was added"});
}catch(error){
    return res.json({error: error.message});
}
});

/*Route        : /publication/update/book
Description    :update/add new book to a publication,assume a book can have just one publication
Access         :PUBLIC
Parameter      :isbn
Methods        :PUT
*/
Router.put("/update/book/:isbn", async(req,res)=>{
    //update the publication database
    try{const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.body.pubId
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },
        {
            new: true
        });
    //update book database
    const updatedBooks = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet:{
                publication: req.body.pubId
            }
        },
        {
            new: true
        }
    );

    
    return res.json({books: updatedBooks, publications: updatedPublication});
    }catch(error){
        return res.json({error: error.message});
    }
});

/*Route        : /publication/delete
Description    :Delete an publication
Access         :PUBLIC
Parameter      :pubId
Methods        :DELETE
*/
Router.delete("/delete/:pubId",async (req,res)=>{
    try{const updatedPublication = await PublicationModel.findOneAndDelete({id: parseInt(req.params.pubId)});
        return res.json({publication: updatedPublication});
}catch(error){
    return res.json({error: error.message});
}
});

/*Route        : /publication/delete/book
Description    :Delete a book from publication.
Access         :PUBLIC
Parameter      :pubId,isbn
Methods        :DELETE
*/
Router.delete("/delete/book/:isbn/:pubId",async(req,res)=>{
    //update the publication database
  try{ const updatedPublication = await PublicationModel.findOneAndUpdate(
       {
           id: parseInt(req.params.pubId)
       },
       {
           $pull:{
               books: req.params.isbn
           }
       },
       {
           new: true
       });
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $pull:{
                publication: parseInt(req.params.pubId)
            }
        },
        {
            new: true
        }
    );
    
    return res.json({books: updatedBook, publications: updatedPublication});
    }catch(error){
        return res.json({error: error.message});
    }
});

module.exports = Router;