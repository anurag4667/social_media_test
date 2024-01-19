const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config({
        path: "backend/config/config.env"
    });
}

//using middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieparser());
app.use(cors({
    origin : [process.env.FRONTEND_URL],
    methods : ["GET",'POST','PUT','DELETE'],
    credentials : true,
}))

//importing routes
const post = require("./routes/post.js");
const user = require("./routes/user.js");

//using routes
app.use("/api/v1",post);
app.use("/api/v1",user);
module.exports = app;