import expressAsyncHandler from "express-async-handler";
import asyncHandler from "express-async-handler";
import crypto from 'crypto'


import generateToken from "../../config/token/generateToken.js";

import User from "../../model/user/User.js";
import validateMongodbId from "../../utils/validateMongoDbId.js";
import sgMail from '@sendgrid/mail';
import cloudinaryUoloadImage from "../../utils/cloudinary.js";
import fs from "fs";

import blockUser from "../../utils/blockUser.js";

import dotenv from "dotenv"
dotenv.config()



/*********************************
 * mail send config
 * *******************************
 */

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SERVER_EMAIL = process.env.EMAIL






/*********************************
 * register
 * *******************************
 */
const userRegisterCtrl = asyncHandler(async (req, res) => {
  // business logic: register user
  //   console.log(req.body);

  // check if the user exists
  const userExists = await User.findOne({ email: req?.body?.email });

  if (userExists) {
    throw new Error("user already exists");
  }

  try {
    const user = await User.create({
      // firstName: "Majedul",
      // lastName: "hasan",
      // email: "e3@gmail.com",
      // firstName: req.body && req.body.firstName,
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

/*********************************
 * Login
 * *******************************
 */

const loginUserCtrl = asyncHandler(async (req, res) => {
  // business logic: register user
  const { email, password } = req.body;

  // check if the user exists
  // const userFound = await User.findOne({ email: req?.body?.email })
  const userFound = await User.findOne({ email });
  /*
  if (!userFound) {
    throw new Error("Login credintials are not valied");
  }
  */
  if(userFound?.isBlocked) throw new Error('Access Denied You have been block')
  

  // check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
      isAccountVerified: userFound?.isAccountVerified
    });
  } else {
    res.status(404);
    throw new Error("Login credintials are not valied");
  }
  // res.json("user login");
});

/*********************************
 * Users Fetch
 * *******************************
 */

const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {



  //console.log(req.headers);
  try {
    const users = await User.find({}).populate("posts");
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

/*********************************
 * delete a User
 * *******************************
 */

const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // chack if iser id is valied
  validateMongodbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }

  // if (!id) throw new Error("please provide user ID");
  //
});

/*********************************
 * fetch a User details
 * *******************************
 */

const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // chack if iser id is valied
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }

  
});

/*********************************
 *  User profile
 * *******************************
 */

 const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  //console.log("line 165", typeof id);
  

  // chack if iser id is valied
  validateMongodbId(id);

  // 1. find the login user


  //2.check the user viewed by is already exist in the array of ViewedBy 

  // get login user

  const loggedInUserId  = req?.user?._id?.toString()




  try {
    const myProfile = await User.findById(id).populate("posts").populate("viewedBy")
    // find in array
    const alreadyViewed = myProfile?.viewedBy?.find(user=> {
      return user?._id?.toString() === loggedInUserId
    })

    const myId = myProfile?.viewedBy?.find(user=> {
      return loggedInUserId === id
    })

  
//console.log(typeof alreadyViewed);
//console.log(myId);


   

    if(alreadyViewed || loggedInUserId === id  ){
      // .populate("posts") => can create a virtual fild name posts
      //console.log('if statement');
      
    res.json(myProfile )
    } else{
      const profile = await User.findByIdAndUpdate(myProfile?._id, {
        $push:{viewedBy:loggedInUserId }
      })
      //console.log('else statement');

      res.json(profile)

    }
    

    

    
  } catch (error) {
    res.json(error);
  }

  
});

/*********************************
 *  User profile update
 * *******************************
 */

 const updateUserCtrl = expressAsyncHandler(async (req, res) => {
   const {id} = req?.user
//console.log("object id   ",id)
// chack if iser id is valied

blockUser(req?.user);
validateMongodbId(id);

const user = await User.findByIdAndUpdate(id, {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
      

}, {
  new: true,
  runValidators: true
})

 
  res.json(user)


  
});


/*********************************
 *  User password update
 * *******************************
 */

const  updateUserPasswordCtrl = expressAsyncHandler(async(req, res)=>{
  //destructure the login user

  const {id} = req.user
  
  const {password} = req.body
  
validateMongodbId(id);

const user = await User.findById(id)


if( password){
  user.password = password;
  await user.save()
  
}
res.json(user)



})

/*********************************
 *  following
 * *******************************
 */
const followingUserCtrl = expressAsyncHandler(async (req, res)=>{
  //1. find the user u follow, and update it's follower field
  //2. update the loging following field

  const {followId} = req.body
  const logingUserId = req.user.id
  //console.log({followId, logingUserId})

  // find the target user and check if the login id exist
  
  const targetUser = await User.findById(followId)
  //console.log(targetUser)
  const alreadyFollowing = targetUser?.followers?.find(user=> user?.toString()=== logingUserId.toString() )

  //console.log(alreadyFollowing)

  if (alreadyFollowing) throw new Error('you have already following this user')


  //1. find the user u follow, and update it's follower field
  await User.findByIdAndUpdate(followId, 
    {
      $push:{followers: logingUserId }, 
      isFollowing: true
    },
    {new: true})

  //2. update the loging following field
  await User.findByIdAndUpdate(logingUserId, {$push:{following: followId }}, {new: true})
  


  res.json('you have successfully following ')

})

/*********************************
 *  unfollow
 * *******************************
 */

const unfollowUserCtrl = expressAsyncHandler(async(req, res)=>{

  const {unfollowId} = req.body
  const logingUserId = req.user.id

  
 await User.findByIdAndUpdate(unfollowId, {
   $pull: {followers: logingUserId},
   isFollowing: false


 }, {new: true})
  await User.findByIdAndUpdate(logingUserId, {
    $pull: {following: unfollowId},
  

  },{new: true} )
 
  


  res.json('you have successfully unfollow this user')
})

/*********************************
 *  block user
 * *******************************
 */

 const blockUserCtrl = expressAsyncHandler(async(req, res)=>{

  const {id} = req.params

  validateMongodbId(id)

  const user = await User.findByIdAndUpdate(id, {
    isBlocked: true
  },{new: true} )
   

  res.json(user)

 })


/*********************************
 *  unblock user
 * *******************************
 */

 const unblockUserCtrl = expressAsyncHandler(async(req, res)=>{

  const {id} = req.params

  validateMongodbId(id)

 const user = await User.findByIdAndUpdate(id, {
    isBlocked: false
  },{new: true} )
   

  res.json(user)

 })

/*********************************
 * generete  verification token and  send email
 * *******************************
 */

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res)=>{

    const loginUserId = req.user.id
    //console.log(loginUserId)
    const user = await User.findById(loginUserId)
    //console.log(user)
    try {
        // generate a token
        const verificationToken = await user?.createAccountVerificationToken()
        //console.log(verificationToken)
        // save  the user
        await user.save()
        // build msg
        const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">click to verify</a>`
          const msg = {
              to: user?.email,
              from: SERVER_EMAIL, //  verified sender
              subject: 'verify account',
            //  text: 'and easy to do anywhere, even with Node.js',
              html: resetURL
            };
            await sgMail.send(msg);
          res.send(resetURL);
      } catch (error) {
          res.json(error)
          
      }



    
})

/*********************************
 * account verification 
 * *******************************
 */

const accountVerificationCtrl = expressAsyncHandler(async (req, res)=>{
    const {token} = req.body


    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    //console.log(hashedToken)
    //find this user by token
    const userFound = await User.findOne({accountVerificationToken:hashedToken, accountVerificationTokenExpires: {$gt: new Date()} });
    if(!userFound) throw new Error ('token expired, try again')
    // update the property true
    userFound.isAccountVerified = true
    userFound.accountVerificationToken = undefined
    userFound.accountVerificationTokenExpires = undefined

    await userFound.save()



    res.json(userFound)
})

/*********************************
 * forget password reset 
 * *******************************
 */


// generate && send token to the user account

const forgetPasswordToken = expressAsyncHandler(async(req, res)=>{
    // find the user by email

    const {email} = req.body

    const user =  await User.findOne({email})
    if(!user) throw new Error('user nor found')

    try {
    const token =    await user.createPasswordResetToken()
  
    await user.save()
    // build msg
    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/reset-password/${token}">click to reset</a>`
    const msg = {
        to: email,
        from: SERVER_EMAIL, //  verified sender
        subject: 'reset password',
      //  text: 'and easy to do anywhere, even with Node.js',
        html: resetURL
      };
     await sgMail.send(msg);

     res.json({
        // msg: `a verification message is sent to ${user?.email}, reset now within 10 minutes, ${resetURL} `
         msg: `a verification message is sent to ${user?.email}, reset now within 10 minutes`
     })    
    } catch (error) {
        throw new Error('un expected error, try again')
        
    }


   
})


// take the token find


const passwordResetCtrl = expressAsyncHandler(async (req, res)=>{

    const {token, password} = req.body

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')


    //console.log(hashedToken)
    //find this user by token
    const user = await User.findOne({passwordRessetToken:hashedToken, passwordRessetExpires: {$gt: new Date()}
         });
    if(!user) throw new Error ('token expired, try again')
    // update the property true
   user.password = password
    user.passwordRessetToken = undefined
    user.passwordRessetExpires = undefined

    await user.save()



    res.json(user)
    
})


/*********************************
 * forget password reset 
 * *******************************
 */

/*********************************
 * profile photo upload 
 * *******************************
 */

const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res)=>{
    //console.log(req.file)
    // find the logged in user
    //console.log({user: req.user})
    const {_id} = req?.user

    blockUser(req?.user);

    


    // 1. get the auth to img

    const localPath = `public/images/profile/${req.file.filename}`

    //2. upload to cloudinary 

    const imageUploaded  = await cloudinaryUoloadImage(localPath)
    //console.log(imageUploaded.secure_url)

    // find the user 
    const userFound = await User.findByIdAndUpdate(_id, {profilePhoto: imageUploaded?.secure_url }, {new : true});


    res.json(userFound)
    // remove saved image
    fs.unlinkSync(localPath)
})


 export {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  profilePhotoUploadCtrl
  
};
