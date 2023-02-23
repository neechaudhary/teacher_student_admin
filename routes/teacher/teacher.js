const express= require("express");
const router= express.Router();
const { signup ,signin } = require("../../controllers/teacher/teacher_auth");
const { validateSignupRequest, isRequestValidated,validateSigninRequest } = require("../../validators/auth");


router.post("/teacher/signup",validateSignupRequest, isRequestValidated, signup);

router.post("/teacher/signin",validateSigninRequest,isRequestValidated, signin);

//if user is logged in how can we navigate him to the protected route eg. profile
//we will use a middleware to check if user is logged in or not
// router.post("/profile", requireSignin, (req, res) => {
//     res.status(200).json({user: "profile"});
// });


module.exports= router;