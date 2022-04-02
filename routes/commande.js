const express=require('express')
const auth=require('./auth')

const router =express.Router();
const Commande=require('../models/commande')

router.get('/',auth,async (req,res)=>{
    try{
        const commandes=await Commande.find()
        res.json(commandes)
    }
    catch(err){
        res.send('err='+err)
    }
})

router.post('/',auth,async (req,res)=>{
    const commande=new Commande({
        utilisateur:req.utilisateur._id,
        plats:req.body.plats,
        dateLivraison:req.body.dateLivraison,
        etat:req.body.etat
    })
    try{
        const p=await commande.save()
        res.json(p)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

module.exports=router