const express=require('express')

const router =express.Router();
const Utilisateur=require('../models/utilisateur')
const{registerValidation, loginValidation}=require('../utils/validation')
const dotenv=require('dotenv')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

dotenv.config()

router.get('',async (req,res)=>{
    try{
        const utilisateur=await Utilisateur.find()
        res.json(utilisateur)
    }
    catch(err){
        res.send('err='+err)
    }
})


router.post('/register',async (req,res)=>{
    const salt=await bcrypt.genSalt(10)
    const hashed_pwd=await bcrypt.hash(req.body.pwd,salt);
    const utilisateur=new Utilisateur({
        nom:req.body.nom,
        email:req.body.email,
        login:req.body.login,
        type:req.body.type,
        pwd:hashed_pwd
    })

    try{
        const emailExist= await Utilisateur.findOne({email:req.body.email});
        // check email
        if(emailExist) return res.status(400).send('Email already exist')
        // Validation
        const {error}=registerValidation(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        // Save the user
        const u=await utilisateur.save()
        res.json({utilisateur:u._id})       
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

router.post('/login',async (req,res)=>{
    const utilisateur= await Utilisateur.findOne({email:req.body.email});
    // check email
    if(!utilisateur) return res.status(400).send('Email does not exist')
    // Validation
    const {error}=loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    // check password
    const compare_pwd=bcrypt.compare(req.body.pwd,utilisateur.pwd)
    if(!compare_pwd) return res.status(400).send('Wrong password')
    // sign token
    const token=jwt.sign({_id:utilisateur._id},process.env.SECRET_TOKEN)
    res.header('auth-token',token).send(token)
})

module.exports=router