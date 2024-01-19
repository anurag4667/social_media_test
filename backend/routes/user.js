const express = require("express");
const { isauthenticated  } = require("../middlewares/auth.js");
const { register ,login , followUser,logout,updatepassword,updateprofile, deletemyprofile, myprofile, getuserprofile, getallusers} = require("../controllers/user.js");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/follow/:id").get(isauthenticated, followUser);
router.route("/update/password").put(isauthenticated,updatepassword);
router.route("/update/profile").put(isauthenticated,updateprofile);
router.route("/deletemyprofile").delete(isauthenticated,deletemyprofile);
router.route("/me").get(isauthenticated,myprofile);
router.route("/profile/:id").get(isauthenticated,getuserprofile);
router.route("/users").get(isauthenticated,getallusers);
module.exports = router;
