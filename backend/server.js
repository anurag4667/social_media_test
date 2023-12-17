const app = require("./app.js");
const {connectdatabase} = require("./config/database.js");

connectdatabase();

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})