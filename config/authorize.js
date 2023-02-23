const user = require("../models/user");
const jwt = require("jsonwebtoken");

async function getauthuser(req,res,next){
    try {
        // console.log(req.headers);
        // console.log(req.body);
        const token=req.headers["token"]|| req.cookie.token;
        if(!token){
            return res.status(401).json({message: "Unauthorized"});

        }
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user= await user.findById(decoded._id);
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports= {getauthuser};