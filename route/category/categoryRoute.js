import  express from 'express'

import { 
    categoryCtrl,
    fetchAllCategoryCtrl,
    fetchCategoryCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl

     } from '../../controllers/category/categoryCtrl.js'
import authMiddleWare from '../../middlewares/authMiddleware.js'




const categoryRoutes = express.Router()


categoryRoutes.post('/',authMiddleWare ,  categoryCtrl)
categoryRoutes.get('/',  fetchAllCategoryCtrl)
categoryRoutes.get('/:id',authMiddleWare ,  fetchCategoryCtrl)
categoryRoutes.put('/:id',authMiddleWare , updateCategoryCtrl )
categoryRoutes.delete('/:id',authMiddleWare , deleteCategoryCtrl )





 export default categoryRoutes