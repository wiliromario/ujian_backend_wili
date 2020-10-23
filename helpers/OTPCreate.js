const jwt=require('jsonwebtoken')
const otpcreate=()=>{
    let expires='1m'
    let otp
    do {
        otp =Math.random()
        otp=otp*10000
        otp=parseInt(otp)
        otp=`${otp}`
    } while (otp.length!==4);
    let newotp={
        otp:otp,
        otptoken:jwt.sign({otp},"spiritking",{expiresIn:`${expires}`}),
        expires
    }
    return newotp
}
module.exports=otpcreate
