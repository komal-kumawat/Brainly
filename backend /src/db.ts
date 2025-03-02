import mongoose from "mongoose";
mongoose.connect("mongodb+srv://komalK:komal%40123@atlascluster.fukzabb.mongodb.net/brainly")
    .then(()=>console.log("connected to mongodb"))
    .catch((err)=>{console.error("error while connecting  to mongodb",err)});


// userSchema
const userSchema = new mongoose.Schema(
    {
        username:{type:String ,required:true , unique:true,min:3},
        password:{type:String, required:true , min:8}
    }
)
const User = mongoose.model('User' , userSchema);

// tagschema
const tagSchema = new mongoose.Schema({
    title:{type:String, required:true , unique:true}
})
const Tag = mongoose.model('Tag',tagSchema);

// contentSchema 
const contentType = ['Audio','Video','Images','article']
const contentSchema = new mongoose.Schema({
    link:{type:String,required:true},
    type:{type:String,enum:contentType,required:true},
    title:{type:String,required:true},
    tags:[{type:mongoose.Schema.Types.ObjectId , ref:Tag}],
    userId:{type:mongoose.Schema.Types.ObjectId , ref:User , required:true},

})
const Content = mongoose.model("Content",contentSchema);

// LinkSchema
const linkSchema = new mongoose.Schema({
    hash:{type:String , required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:User,required:true},
})
const Link = mongoose.model("Link",linkSchema);

export { User, Tag, Link, Content };
