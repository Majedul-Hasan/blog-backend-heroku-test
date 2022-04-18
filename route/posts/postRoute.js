import express from 'express'
import { 
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    updatePostCtrl,
    deletePostCtrl,
    toggleLikesToPostCtrl,
    toggleDislikesToPostCtrl
    } from '../../controllers/posts/PostCtrl.js'

import authMiddleWare from '../../middlewares/authMiddleware.js'
import { postImageResize, photoUpload } from '../../middlewares/photoUpload.js'


const postRoutes = express.Router()

postRoutes.put('/likes', authMiddleWare,  toggleLikesToPostCtrl )
postRoutes.put('/dislikes', authMiddleWare,  toggleDislikesToPostCtrl )
postRoutes.post('/', authMiddleWare, photoUpload.single('image'), postImageResize, createPostCtrl )
postRoutes.get('/',  fetchPostsCtrl )
postRoutes.get('/:id',  fetchPostCtrl )
postRoutes.put('/:id', authMiddleWare,  updatePostCtrl )

postRoutes.delete('/:id', authMiddleWare,  deletePostCtrl )






export default postRoutes