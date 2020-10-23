const {db}=require('../connection')
const {transporter,otpcreate,otpconfirm}=require('../helpers')
const fs=require('fs')
const handlebars=require('handlebars')
// const otpconfirm = require('../helpers/OTPConfirm')

const DbPROMselect=(sql)=>{
    return new Promise((resolve,reject)=>{
        db.query(sql,(err,results)=>{
            if(err){
                reject(err)
            }else{
                resolve(results)
            }
        })
    })
}

module.exports={

    // Sent OTP Ujian Nomer 1: Ubahan di database yg non null hanya id dan email 
    // dan OTP data type diubah aku ubah jadi varchar(500).

    // POST: http://localhost:8000/ujian/sentotp
    
    sentotp: async (req,res)=>{
        let {email}=req.body
        let otp=otpcreate()
        let senttosql={
            email,
            otp:otp.otptoken
        }
        let sql=`insert users set ${db.escape(senttosql)}`
        try{
            const user=await DbPROMselect(sql)
            const htmlrender=fs.readFileSync('./emailtemplate/verification.html','utf8')
            const template=handlebars.compile(htmlrender) 
            const htmlemail=template({email:email,otp:otp.otp,expires:otp.expires})
            transporter.sendMail({
                from:"Dodolan Hasil Bumi<wiliromarioakukom@gmail.com>",
                to:email,
                subject:'OTP Dodolan Hasil Bumi',
                html:htmlemail
            },(err)=>{
                if(err){
                    return res.status(500).send({message:err.message})
                }
                
                return res.send(message=`OTP telah dikirimkan ke email ${email}`)
            })
        }catch(err){
            return res.status(500).send(err)
        }
    },
    confirmotp: async (req,res)=>{
        let {otp,email}=req.body
        let sql=`select otp from users where email = ${db.escape(email)}`
        try{
            const otptoken=await DbPROMselect(sql)
            let istrue=otpconfirm(otp,otptoken[0].otp)
            if(istrue===true){
                return res.status(200).send(message='OTP Benar')
            }else if(istrue===false){
                return res.status(200).send(message='OTP SALAH')
            }
            else{
                return res.status(200).send(message='OTP Expired')
            }
        }catch(err){
            return res.status(500).send(message='Harus ada Email dan otp')
        }
    },
    // Ujian Nomeer 2

    // Get :  http://localhost:8000/ujian/pendapatan

    // Pendapatan : Hanya yg status Finished
    // Pendapatanpotensi : Menghiraukan Status

    pendapatandanpotensi: async(req,res)=>{
        let sql=`select sum(hargabeli*quantity*0.1) as pendapatan from transaksi
        where status='Finished'`
        try{
            const pendapatan=await DbPROMselect(sql)
            sql='select sum(hargabeli*quantity*0.1) as pendapatanpotensi from transaksi'
            const pendapatanpotensi=await DbPROMselect(sql)
            let datasend={
                pendapatan:pendapatan,
                pendapatandanpotensi:pendapatanpotensi
            }
            res.status(200).send(datasend)
        }catch(err){
            return res.status(500).send(err)
        }
    },

    // Get : http://localhost:8000/ujian/penjualterbaik

    // Penjual Terbaik berdasarkan jumlah transaksi yg Finished. (Bukan qty)

    penjualterbaik: async(req,res)=>{
        let sql=`select t.penjualid, p.namatoko, count(*) as transaksiselesai 
        from transaksi t join penjual p on t.penjualid=p.id where t.status='Finished' 
        group by penjualid`
        try{
            const penjualterbaik=await DbPROMselect(sql)
            res.status(200).send(penjualterbaik)
        }catch(err){
            return res.status(500).send(err)
        }
    },

    // Category Terbaik berdasarkan jumlah transaksi yg Finished. (Bukan qty)

    bestcategory: async(req,res)=>{
        let sql=`select cp.id, cp.namacategory ,count(*) as terbanyakditransaksifinished from transaksi t
        join products p on t.productid=p.id join category_products cp on p.categoryprodid=cp.id
        where t.status='Finished' group by cp.id order by terbanyakditransaksifinished desc limit 1`
        try{
            const bestcategory=await DbPROMselect(sql)
            res.status(200).send(bestcategory)
        }catch(err){
            return res.status(500).send(err)
        }
    },

    // User yang bukan penjual = Tidak memiliki ID PENJUAL

    userbukanpenjual: async(req,res)=>{
        let sql=`select count(*) as jumlahuserbukanpenjual from users u left join penjual p
        on u.id=p.userid where p.id is null`
        try{
            const userbukanpenjual=await DbPROMselect(sql)
            res.status(200).send(userbukanpenjual)
        }catch(err){
            return res.status(500).send(err)
        }
    },
    
    // Ujian Nomeer 3

    // Best Enam Product berdasarkan terbanyak di transaksikan. Bukan berdasarkan QTY. Menghiraukan Status.
    

    bestenamproduct: async(req,res)=>{
        let sql=`select t.productid, pr.image, pe.namatoko, pr.nama as namaproduk, pr.informasiproduct ,count(*) as terbanyakditransaksi from transaksi t
        join products pr on t.productid=pr.id join penjual pe on pr.penjualid=pe.id
        group by t.productid order by terbanyakditransaksi desc limit 6`
        try{
            const bestenamproduct=await DbPROMselect(sql)
            res.status(200).send(bestenamproduct)
        }catch(err){
            return res.status(500).send(err)
        }
    }
}