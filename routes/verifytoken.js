import jwt from "jsonwebtoken";
export const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err,user)=>{
            if(err) res.status(403).json("Token is not valid");
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("Token is not authenticated")
    }// Validasi apakah token yg digunakan USER di verifikasi atau tidak menggunakan jwt.verify
};

export const authorizationToken = (req,res,next)=>{
    verifyToken(req,res,()=>{//setelah dilakukan verifikasi verifyToken dan authorizationToken akan di lanjutkan ke bawah
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You're not allowed")
        }
    });
}
export const authorizationTokenAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{//setelah dilakukan verifikasi verifyToken dan authorizationToken akan di lanjutkan ke bawah
        if(req.user.isAdmin){//verifikasi hanya untuk apabila user yg dikembalikan oleh verifyToken adalah admin maka akan dilanjutkan
            next();
        }else{
            res.status(403).json("You're not allowed")
        }
    });
}
