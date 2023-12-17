const User = require("../models/user.js");

exports.register = async (req,res) =>{
    try{
        const {name,email,password} = req.body;

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success : false,
                message : "user already exist",
            })
        }

        user = await User.create({name,email,password , avatar : {public_id : "sampleid", url : "sample_url"}}) 
        const token =  user.generatetoken();

        res.status(201).cookie("token",token ,{
            expires : new Date(Date.now() + 90*24*60*60*1000),
            httpOnly : true,
        })
        .json({
            success : true,
            user,
            token,
        })
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message,
        })
    }
};

exports.login = async (req,res) =>{

    try{
        const {email,password} = req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(400).json({
                success : false,
                message : "user not found"
            })
        }

        const ismatch = await user.matchpassword(password);

        if(!ismatch){
            return res.status(400).json({
                success : false,
                message : "incorrect password"
            })
        }
        const token =  user.generatetoken();

        res.status(200).cookie("token",token ,{
            expires : new Date(Date.now() + 90*24*60*60*1000),
            httpOnly : true,
        })
        .json({
            success : true,
            user,
            token,
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}