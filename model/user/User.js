import mongoose from "mongoose";

import bcrypt from "bcryptjs";
import crypto from 'crypto'

// create schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "first name is required"],
      type: String,
    },
    lastName: {
      required: [true, "Last name is required"],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      required: [true, "email is required"],
      type: String,
    },
    bio: {
      type: String,
    },
    password: {
      required: [true, "password is required"],
      type: String,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordRessetToken: String,
    passwordRessetExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);


// virtual method to populate created post

userSchema.virtual('posts', {
  ref:'Post',
  foreignField: 'user',
  localField: '_id'

})

// virtual method to create accountType

userSchema.virtual('accountType').get(function(){
  const totalFollowers = this.followers?.length
  return totalFollowers >= 2 ? "pro account" : "starter account"
  
})






// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // console.log(this);
  // hash password
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

// match hashed password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// verify account
userSchema.methods.createAccountVerificationToken = async function (){
     // create token
     const verificationToken = crypto.randomBytes(32).toString('hex');
     this.accountVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')

     this.accountVerificationTokenExpires = Date.now()+ 10*60*1000 //10min

     return verificationToken

}


// password reset/ forgetPassword
userSchema.methods.createPasswordResetToken = async function (){
    // create token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordRessetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //console.log({resetToken})


    this.passwordRessetExpires = Date.now()+ 10*60*1000 //10min

    return resetToken

}


// compile Schema into model

const User = mongoose.model("User", userSchema);

export default User;
