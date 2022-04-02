const express=require('express')
const auth=require('./auth')

const router =express.Router();
const Plat=require('../models/plat')

router.get('/',auth,async (req,res)=>{
    try{
        const plats=await Plat.find()
        res.json(plats)
    }
    catch(err){
        res.send('err='+err)
    }
})

router.post('/',auth,async (req,res)=>{
    const plat=new Plat({
        nom:req.body.nom,
        prix:req.body.prix,
        restaurant:req.body.restaurant
    })
    try{
        const p=await plat.save()
        res.json(p)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

module.exports=router