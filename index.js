require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const moviesRoute = require("./routes/moviesRoute.js")

const app = express();
app.use(express.json())
const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGO_URL)
.then(()=>
    {console.log("connected to db")
})
.catch((e)=>{
   console.log(e)  
})

app.use("/movies",moviesRoute)

app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)
})