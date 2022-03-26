const express=require('express')
const auth=require('./auth')

const router =express.Router();
const Menu=require('../models/menu')
router.get('',auth,async (req,res)=>{
    try{
        const menus=await Menu.find()
        res.json(menus)
    }
    catch(err){
        res.send('err='+err)
    }
})

router.post('',async (req,res)=>{
    const menu=new Menu({
        nom:req.body.nom,
        prix:req.body.prix,
        dispo:req.body.dispo
    })
    try{
        const m=await menu.save()
        res.json(m)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

module.exports=router