const express=require('express')
const mongoose=require('mongoose')

const url="mongodb+srv://jahnhahcraven:1234@resto.gtht4.mongodb.net/Resto?retryWrites=true&w=majority"

const app=express()
app.use(express.json())

mongoose.connect(url,{useNewUrlParser:true})
const connection=mongoose.connection

connection.on('open',()=>{
    console.log('connected ...')
})

const menuRouter=require('./routes/menu')

app.use('/menu',menuRouter)

app.listen(9000,()=>{
    console.log('server started...')
});