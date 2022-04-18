import expressAsyncHandler from "express-async-handler";
import sgMail from '@sendgrid/mail';
import EmailMsg from "../../model/emailMessaging/EmailMessaging.js";
import dotenv  from "dotenv"

import Filter from 'bad-words';

dotenv.config()



sgMail.setApiKey(process.env.SENDGRID_API_KEY)





const sendEmailMsgCtrl = expressAsyncHandler(async(req, res)=>{
    const {
        to,
        subject,
        message
        } = req.body

    // get the msg

    const emailMsg = subject + " "+ message
    // check for bad-words
    const filter = new Filter

    const isProfane = filter.isProfane(emailMsg)    
    //console.log(isProfane)

     // block user
     if(isProfane){     
   
     throw new Error('email failed because it contains profen words')
     }
    //  bad-words


    try {
        // build up msg
        const msg = {
            to,
            from: "hasanmajedul@gmail.com", // Change to your verified sender
            subject,
            text: message
            }

        await sgMail.send(msg)
        // save to db

        //console.log(req?.user)

        const msgDB = await EmailMsg.create({
            sentBy: req?.user?._id ,
            from: req?.user?.email,
            to ,
            message ,
            subject ,
        })

    res.json("mail sent")
        
    } catch (error) {
    res.json(error)
        
    }


})


export  {
    sendEmailMsgCtrl
}