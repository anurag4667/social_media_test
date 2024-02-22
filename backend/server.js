const app = require("./app.js");
const {connectdatabase} = require("./config/database.js");
const cloudinary = require("cloudinary");
connectdatabase();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})