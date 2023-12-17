const express = require("express");
const { createpost ,likeanddislike ,addcomment,deletepost} = require("../controllers/post.js");
const { isauthenticated  } = require("../middlewares/auth.js")
const router = express.Router();

router.route("/post/upload").post(isauthenticated,createpost);
router.route("/post/:id").get(isauthenticated,likeanddislike).delete(isauthenticated,deletepost);
router.route("/post/:id").post(isauthenticated,addcomment);
module.exports = router;
