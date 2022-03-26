const jwt=require('jsonwebtoken')

module.exports=function auth(req,res,next){
    const token=req.header('auth-token');
    if(!token) return res.status(401).send('Access Forbidden')

    try{
        const verified=jwt.verify(token,process.env.SECRET_TOKEN)
        req.utilisateur=verified
        next()
    }catch{
        res.status(400).send('invalid token')
    }
}