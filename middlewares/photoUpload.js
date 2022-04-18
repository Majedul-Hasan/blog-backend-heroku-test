import multer from 'multer'
import path from 'path'


import sharp from 'sharp'


// storage
const multerStorage = multer.memoryStorage() // The memory storage engine stores the files in memory as Buffer objects. It doesn’t have any options.

// file type checking

const multerFilter = (req, file, cb)=>{
    // check file type
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    } else{
        // rejected files
       
       
        cb({ message: 'unsupported file formate '}, false)
    }

}

const photoUpload = multer({
    storage : multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 3000000}

})


// image Resize

 const profilePhotoResize = async(req, res, next)=>{
    // console.log(req.file)
     if(!req.file) return next()
//
     req.file.filename = `user-${Date.now()}-${req.file.originalname}`
    // console.log('image Resize  ', req.file)
    await sharp(req.file.buffer).resize(250, 250).toFormat('jpeg').jpeg({quality: 90}).toFile(path.join(`public/images/profile/${req.file.filename}`))

next()
 }

 const postImageResize = async(req, res, next)=>{
    // console.log(req.file)
     if(!req.file) return next()
//
     req.file.filename = `user-${Date.now()}-${req.file.originalname}`
    // console.log('image Resize  ', req.file)
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(path.join(`public/images/posts/${req.file.filename}`))

next()
 }




export  {profilePhotoResize , photoUpload, postImageResize}