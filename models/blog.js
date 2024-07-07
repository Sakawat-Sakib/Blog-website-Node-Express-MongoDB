const mongoose = require('mongoose');



const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    
    },
    body:{
        type: String,
        
    },
    coverImageURL: {
        type: String,
     
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, //As this field depend on another collection
        ref: 'user',

    },
   
    
},{timestamps: true});






const Blog = mongoose.model('blog',blogSchema);


module.exports = Blog;



