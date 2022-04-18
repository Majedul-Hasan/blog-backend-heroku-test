import express from 'express'

import { 
    createCommentCtrl, 
    fetchAllCommentsCtrl,
    fetchCommentCtrl,
    updateCommentCtrl,
    deleteCommentCtrl
    
     } from '../../controllers/comments/commentCtrl.js'

import authMiddleWare from '../../middlewares/authMiddleware.js'





const commentRoutes = express.Router()

commentRoutes.post('/',authMiddleWare, createCommentCtrl )
commentRoutes.get('/', fetchAllCommentsCtrl )
commentRoutes.get('/:id',authMiddleWare, fetchCommentCtrl )
commentRoutes.put('/:id',authMiddleWare, updateCommentCtrl )
commentRoutes.delete('/:id',authMiddleWare, deleteCommentCtrl )





export default commentRoutes