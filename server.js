const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')

dotenv.config()
const url=process.env.DB_URL
const app=express()
app.use(express.json())

mongoose.connect(url,{useNewUrlParser:true})
const connection=mongoose.connection

connection.on('open',()=>{
    console.log('connected ...')
})

const menuRouter=require('./routes/menu')
const utilisateurRouteur=require('./routes/utilisateur')
app.use('/menu',menuRouter)
app.use('/utilisateur',utilisateurRouteur)

app.listen(9000,()=>{
    console.log('server started...')
});