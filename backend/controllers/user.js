const User = require("../models/user.js");
const Post = require("../models/post.js");
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
            sameSite : process.env.NODE_ENV === "development" ? "lax" : "none",
            secure : process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success : true,
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
            sameSite : process.env.NODE_ENV === "development" ? "lax" : "none",
            secure : process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success : true,
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

exports.logout = async (req,res) =>{
    try{
        res.status(200)
        .cookie("token" , null ,{expires : new Date(Date.now())
            ,httpOnly : true,
            sameSite : process.env.NODE_ENV === "development" ? "lax" : "none",
            secure : process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success : true,
            message : "logged out"
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}
exports.followUser = async (req,res) =>{
    try{
        const usertofollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!usertofollow){
            return res.status(404).json({
                success : false,
                message : "user not found"
            })
        }

        if(loggedInUser.following.includes(usertofollow._id)){
            const index1 = loggedInUser.following.indexOf(usertofollow._id);
            const index2 = usertofollow.followers.indexOf(loggedInUser._id);
            
            loggedInUser.following.splice(index1,1);
            usertofollow.followers.splice(index2,1);

            await loggedInUser.save();
            await usertofollow.save();

            return res.status(200).json({
                success : true,
                message : "user unfollowed"
            })
        }
        else{
            loggedInUser.following.push(usertofollow._id);
            usertofollow.followers.push(loggedInUser._id);

            await loggedInUser.save();
            await usertofollow.save();

            res.status(200).json({
                success : true,
                message : "user followed"
            })
        }
        
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

exports.updatepassword = async(req,res) =>{
    try{
        const user = await User.findById(req.user._id).select("+password");

        const {oldpassword,newpassword} = req.body;

        if(!oldpassword || !newpassword){
            return res.status(400).json({
                success : false,
                message : "please enter old and new password"
            })
        }

        const verify = await user.matchpassword(oldpassword);

        if(!verify){
            return res.status(400).json({
                success : false,
                message : "old password is incorrect"
            })
        }

        user.password = newpassword;
        await user.save()

        res.status(200).json({
            success : "true",
            message : "password changed"
        })
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

exports.updateprofile = async (req,res) =>{
    try{
        const user = await User.findById(req.user._id);

        const {name , email} = req.body;

        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            success : true,
            message : "profile updated"
        })
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

exports.deletemyprofile = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userid = user._id;
        await user.deleteOne();
        
        res.cookie("token" , null ,{expires : new Date(Date.now())
            ,httpOnly : true,
            sameSite : process.env.NODE_ENV === "development" ? "lax" : "none",
            secure : process.env.NODE_ENV === "development" ? false : true,
        });

        for(let i = 0; i < posts.length ; i++){
            const post = await Post.findById(posts[i]);
            await post.deleteOne();
        }

        for(let i = 0; i < followers.length ; i++){
            const follower = await User.findById(followers[i]);

            const index = follower.following.indexOf(userid);
            follower.following.splice(index,1);
            await follower.save();
        }

        for(let i = 0; i < following.length ; i++){
            const follows = await User.findById(following[i]);

            const index = follows.followers.indexOf(userid);
            follows.followers.splice(index,1);
            await follows.save();
        }

        res.status(200).json({
            success : true,
            message : "profile deleted",
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}

exports.myprofile = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id).populate("posts");

        res.status(200).json({
            success : true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}

exports.getuserprofile = async (req,res) =>{
    try {
        const user = await User.findById(req.params.id).populate("posts");

        if(!user){
            res.status(404).json({
                success : false,
                message: "user not found",
            })
        }

        return res.status(200).json({
            success : true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "intenal server error",
        })
    }
}

exports.getallusers = async (req,res) =>{
    try{
        const users = await User.find({});

        res.status(200).json({
            success : true,
            users,
        })
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : "intenal server error",
        })
    }
}


