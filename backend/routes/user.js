const express = require("express");
const { isauthenticated  } = require("../middlewares/auth.js");
const { register ,login , followUser,logout,updatepassword,updateprofile} = require("../controllers/user.js");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/follow/:id").get(isauthenticated, followUser);

router.route("/update/password").put(isauthenticated,updatepassword);
router.route("/update/profile").put(isauthenticated,updateprofile);
module.exports = router;
