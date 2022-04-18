import express from "express"
const app = express();

import dotenv from "dotenv"
dotenv.config()

import morgan from "morgan"
app.use(morgan("dev"));

import dbConnect from "./config/db/dbConnect.js";
dbConnect();




//errorHandler
import { errorHandler, notFound } from  "./middlewares/errorHandler.js";

//controllers

import userRoutes from  "./route/users/usersRoute.js"
import postRoutes from  "./route/posts/postRoute.js"
import commentRoutes from  "./route/comments/commentsRoute.js"
import emailRoutes from  "./route/email/emailRouts.js"
import categoryRoutes from  "./route/category/categoryRoute.js"
import cors from  'cors'




// api rought
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(morgan("dev"));

//middleware
app.use(express.json());

// corse
app.use(cors())



if(process.env.NODE_ENV==="development") {
  app.get('/', (req, res)=> res.status(200).send("development") )
  } else {
     app.get('/', (req, res)=> res.status(200).send("production") )
  }



//user route
app.use("/api/users", userRoutes);

//post route
app.use("/api/posts", postRoutes);

//comment route
app.use("/api/comments", commentRoutes);

//Email route
app.use("/api/email", emailRoutes);

//category Routes 
app.use("/api/category", categoryRoutes);

//error Handler
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.port || 5052;
app.listen(PORT, console.log(`server is running on a ${process.env.NODE_ENV} server on port ${PORT}`));