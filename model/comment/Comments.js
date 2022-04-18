import mongoose from "mongoose";
// create schema 

const commentSchema = new mongoose.Schema(
    {
        post:{
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Post',
             required: [true, "Post  is required"]
        },
        //user:{
        //    type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        //     required: [true, "User  is required"]
        //},
        user:{
            type: Object,             
             required: [true, "User  is required"]
        },
        description:{
             type: String,
             required:[true, "Comment description is required"],
        },


    },{
        timestamps: true
    }
)


// compile Schema into model

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

