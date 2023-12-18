const express = require("express");
const { createpost ,likeanddislike ,addcomment,deletepost,showposts,updatecaption} = require("../controllers/post.js");
const { isauthenticated  } = require("../middlewares/auth.js")
const router = express.Router();

router.route("/post/upload").post(isauthenticated,createpost);
router.route("/post/:id").get(isauthenticated,likeanddislike)
.delete(isauthenticated,deletepost)
.post(isauthenticated,addcomment)
.put(isauthenticated,updatecaption);
router.route("/posts").get(isauthenticated,showposts);

module.exports = router;
