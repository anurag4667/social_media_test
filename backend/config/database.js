const mongoose = require("mongoose");

exports.connectdatabase = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then((con)=> console.log(`db connected ${con.connection.host}`))
    .catch((err)=>{
        console.log(err);
    })
};