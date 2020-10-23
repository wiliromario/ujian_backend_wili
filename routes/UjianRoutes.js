const Router=require('express').Router()
const {UjianControllers}=require('./../controllers')

Router.post('/sentotp',UjianControllers.sentotp)
Router.post('/confirmotp',UjianControllers.confirmotp)
Router.get('/pendapatan',UjianControllers.pendapatandanpotensi)
Router.get('/penjualterbaik',UjianControllers.penjualterbaik)
Router.get('/bestcategory',UjianControllers.bestcategory)
Router.get('/userbukanpenjual',UjianControllers.userbukanpenjual)
Router.get('/bestenamproduct',UjianControllers.bestenamproduct)


module.exports=Router