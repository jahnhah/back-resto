const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const dotenv=require('dotenv')

dotenv.config()
const url=process.env.DB_URL
const app=express()
app.use(express.json())
app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect(url,{useNewUrlParser:true})
const connection=mongoose.connection

connection.on('open',()=>{
    console.log('connected ...')
})

const menuRouter=require('./routes/menu')
const utilisateurRouteur=require('./routes/utilisateur')
const restaurantRouter=require('./routes/restaurant')
const platRouter=require('./routes/plat')
const commandeRouter=require('./routes/commande')
const livraisonRouter=require('./routes/livraison')

app.use('/menu',menuRouter)
app.use('/utilisateur',utilisateurRouteur)
app.use('/restaurant',restaurantRouter)
app.use('/plat',platRouter)
app.use('/commande',commandeRouter)
app.use('/livraison',livraisonRouter)

app.listen(9000,()=>{
    console.log('server started...')
});