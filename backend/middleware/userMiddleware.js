const {getUserCookies,refreshToken} =require("../controller/User.Controller");

export const userMiddleware=async(req,res,next)=>{
    try{
        const user=await getUserCookies(req);
        console.log(user);
        next();
    }catch(e){
        res.status(500).json({
            message:"Not a Valid User",
            called:"failed"
        })            
    }
}

