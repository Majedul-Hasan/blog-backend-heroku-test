import  express from 'express'
import  { sendEmailMsgCtrl } from '../../controllers/emailMsg/sendEmail.Ctrl.js'
import  authMiddleWare from '../../middlewares/authMiddleware.js'




const emailRoutes = express.Router()

emailRoutes.post('/',authMiddleWare, sendEmailMsgCtrl)



export default emailRoutes