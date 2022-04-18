import expressAsyncHandler from "express-async-handler";

import Filter from 'bad-words';



import Comment from "../../model/comment/Comments.js";
import validateMongodbId from "../../utils/validateMongoDbId.js";
import blockUser from "../../utils/blockUser.js";





/*********************************
 * create Comment
 * *******************************
 */


const createCommentCtrl = expressAsyncHandler(async(req, res)=>{

    const user = req.user
    // check user if is blocked
    blockUser(user);

   
    
    

    // check for bad-words
    const filter = new Filter

    const isProfane = filter.isProfane(req.body.title, req.body.description)    
    //console.log(isProfane)

     // block user
     if(isProfane){
     
   await User.findByIdAndUpdate(_id, {
       isBlocked: true
     });
     throw new Error('Creating failed because it contains profen words and you have been blocked')
     }
    //  bad-words    

    try {
        const comment = await Comment.create({
      description: req?.body?.description,
       user,
        post: req?.body?.post



        })
        res.json(comment)
    } catch (error) {
     res.json(error)
        
    }

})




 /*********************************
 * Fetch all Comments
 * *******************************
 */

const fetchAllCommentsCtrl = expressAsyncHandler(async(req, res)=>{

  try {
    
    const comments = await Comment.find({}).sort('-createdAt')
  res.json(comments)
  } catch (error) {
  res.json(error)
    
  }
})




 /*********************************
 *  Comments Details
 * *******************************
 */

const fetchCommentCtrl = expressAsyncHandler(async(req, res)=>{
  const {id} = req.params
  validateMongodbId(id)


  //console.log(id)

  try {
    
    const comment = await Comment.findById(id)
  res.json(comment)
  } catch (error) {
  res.json(error)
    
  }
})

 /*********************************
 *  Comments update
 * *******************************
 */

const updateCommentCtrl = expressAsyncHandler(async(req, res)=>{
  const {id} = req.params
  validateMongodbId(id)


  //console.log(id) // comment id

  try {
    
    const update = await Comment.findByIdAndUpdate(id,{

       post: req?.body?.post,  // post id
       description: req?.body?.description,
       user: req?.user

    },{
      new: true, 
      runValidators: true
    })
  res.json(update)
  } catch (error) {
  res.json(error)
    
  }
})


 /*********************************
 * delete a comment
 * *******************************
 */

const deleteCommentCtrl = expressAsyncHandler(async(req, res)=>{
  const {id} = req.params
  validateMongodbId(id)


try {
  await Comment.findByIdAndDelete(id)
  
} catch (error) {
  
res.json(error)
}

res.json('comment deleted successfully')
  


})





export {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl
}