const jwt=require('jsonwebtoken')

const createJWToken=(payload)=>{
    return jwt.sign(payload,"spiritking",{expiresIn:'24h'})
}

module.exports=createJWToken