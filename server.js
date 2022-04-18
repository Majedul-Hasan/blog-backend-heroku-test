import express from "express"
const app = express();

import dotenv from "dotenv"
dotenv.config()

import morgan from "morgan"
app.use(morgan("dev"));



if(process.env.NODE_ENV==="development") {
  app.get('/', (req, res)=> res.status(200).send("development") )
  } else {
     app.get('/', (req, res)=> res.status(200).send("production") )
  }



const PORT = process.env.PORT || 5052;
app.listen(PORT, console.log(`server is running on a ${process.env.NODE_ENV} server on port ${PORT}`));