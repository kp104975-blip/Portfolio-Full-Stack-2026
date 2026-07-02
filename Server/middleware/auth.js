const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const auth = async (req,res,next)=>{
    try{
        let token = req.cookies.token;

        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization;
            }
        }

        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const admin = await Admin.findById(decodedToken.id).select("-password");
        if(!admin){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.admin = admin;
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports = auth;