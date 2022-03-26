const mongoose=require('mongoose')
const Utilisateur = require('./Utilisateur')

const restaurantSchema=mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    responsable:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Utilisateur',
        required:true
    }
})

module.exports=mongoose.model('Restaurant',restaurantSchema)