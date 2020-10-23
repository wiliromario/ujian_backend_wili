const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const bearerToken=require('express-bearer-token')
require('dotenv').config()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bearerToken())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false})); // buat user kirim data ke server
app.use(express.static('public'))



app.get('/',(req,res)=>{
    res.send('<h1>API UJIAN BACKEND Wilibrordus Kevin Romario</h1>')
})

const {
    UjianRoutes, 
}=require('./Routes/')

app.use('/ujian',UjianRoutes)



app.listen(PORT,()=>{
    console.log('API aktif di port '+PORT)
})
