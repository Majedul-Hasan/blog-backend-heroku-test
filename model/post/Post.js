import mongoose from "mongoose";

// create schema 

const postSchema = new mongoose.Schema(
    {
        title:{
            required: true,
            type: String,
            trim: true
        },
        // created by only category
        category:{
            required: [true, "Post category is required"],
            type: String,
            
            

        },
        isLiked:{
            type: Boolean,
            default: false,
        },
        isDisiked:{
            type: Boolean,
            default: false,
        },
        numViews:{
            type: Number,
            default: 0,
        },
        likes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        
        ],
        disLikes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
        user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: [true, "Please Author is required"],
            },
        description:{
             required:[true, "Post description is required"],
             type: String,
        },
        image:{
            type: String,
            default:'https://cdn.pixabay.com/photo/2021/02/06/09/03/man-5987447_960_720.jpg',

        },

        
    },
    {
        toJSON:{
            virtuals: true
        },
        toObject:{
            virtuals: true
        },
        timestamps: true

    }
)


// populate comments

postSchema.virtual('comments', {
    ref: "Comment",
    foreignField: "post",
    localField: '_id'
})



// compile Schema into model

const Post = mongoose.model("Post", postSchema);

export default Post;