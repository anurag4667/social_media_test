const Post = require("../models/post.js");
const User = require("../models/user.js");

exports.createpost = async (req,res)=>{
    try{

        const newpostdata = {
            caption: req.body.caption,
            image : {
                public_id : "req.body.public_id",
                url : "req.body.url",
            },
            owner : req.user._id
        };

        const newpost = await Post.create(newpostdata);

        const user = await User.findById(req.user._id);
        
        user.posts.push(newpost._id);
        
        await user.save();
        res.status(201).json({
            success : true,
            post : newpost,
        });
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }


}
exports.deletepost = async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message : "post not found"
            });
        }

        if(post.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message : "unauthorized"
            });
        }

        
        await post.deleteOne();

        const user = await User.findById(req.user._id);
        
        const index = user.posts.indexOf(req.params.id);

        user.posts.splice(index,1);
        await user.save();
        res.status(200).json({
            status : true,
            message : "post deleted"
        })

    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }

    


}
exports.likeanddislike = async (req,res)=>{
    
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success: true,
                message : "post not found"
            });
        }
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);
    
            post.likes.splice(index,1);
    
            await post.save();
    
            return res.status(200).json({
                success: true,
                message : "unliked the post"
            });
        }
    
        else{
            post.likes.push(req.user._id);
    
            await post.save();

            return res.status(200).json({
                success: true,
                message : "liked the post"
            });
        }
    }
    catch(err){
        res.status(500).json(
            {
                success : false,
                message : err.message
            }
        )
    }
}

exports.addcomment = async (req,res) =>{

    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success: true,
                message : "post not found"
            });
    }
    
    post.comments.push({ user: req.user._id, comment: req.body.comment });

    
    await post.save();
    res.status(200).json({
        status : true,
        message : "comment added"
    })
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
    

}