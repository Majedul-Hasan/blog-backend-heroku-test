import  expressAsyncHandler  from "express-async-handler"
import  Category  from "../../model/category/Category.js"
import  validateMongodbId  from "../../utils/validateMongoDbId.js"



/*********************************
 * create Category
 * *******************************
 */

 const categoryCtrl = expressAsyncHandler(async(req, res)=>{

     try {
         const category = await Category.create({
             user: req?.user?._id,
             title: req.body.title

         })
         res.json(category)
         
     } catch (error) {
         res.json(error)
         
     }
    
 })

 /********************************* 
 * fetch all Category
 * *******************************
 */

 const fetchAllCategoryCtrl = expressAsyncHandler(async(req,res)=>{

     try {
         const categories = await Category.find({}).populate('user').sort('-createdAt')

         res.json(categories)
         
     } catch (error) { 
         res.json(error)
         
     }

 })



 /********************************* 
 * fetch a Category
 * *******************************
 */

 const fetchCategoryCtrl = expressAsyncHandler(async(req,res)=>{

     const {id} = req.params

     try {
         const category = await Category.findById(id)
         res.json(category)
         
     } catch (error) { 
         res.json(error)
         
     }

 })


 /********************************* 
 * update a Category
 * *******************************
 */

 const updateCategoryCtrl = expressAsyncHandler(async(req,res)=>{

     const {id} = req.params

     validateMongodbId(id)
    // console.log(id)

     try {
         const category = await Category.findByIdAndUpdate(id,{
             title: req?.body?.title
         },{
             new: true,
             runValidators: true
         })
         res.json(category)
         
     } catch (error) { 
         res.json(error)
         
     }

 })


 /********************************* 
 * Detete a Category
 * *******************************
 */

 const deleteCategoryCtrl = expressAsyncHandler(async(req,res)=>{

     const {id} = req.params

     validateMongodbId(id)
   

     try {
         await Category.findByIdAndDelete(id)
         res.json("successfully deleted")
         
     } catch (error) { 
         res.json(error)
         
     }

 })



export {
     categoryCtrl,
     fetchAllCategoryCtrl,
     fetchCategoryCtrl,
     updateCategoryCtrl,
     deleteCategoryCtrl
     }
