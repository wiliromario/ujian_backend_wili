const jwt=require('jsonwebtoken')

const otpconfirm=(otpfe,otptokensql)=>{
    let otpsql=jwt.verify(otptokensql, "spiritking", (error,decoded)=>{
        if(error){  
            return "expired"
        }
        return decoded
        
    })
    if(otpsql==="expired"){
        return otpsql
    }
    if(otpfe===otpsql.otp){
        return true
    }else{
        return false
    }
}

module.exports=otpconfirm
