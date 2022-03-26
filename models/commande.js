const { Timestamp } = require("mongodb")
const mongoose=require('mongoose')
const Utilisateur = require("./Utilisateur")

let etat_enum = ["nouveau", "en cours","fini"];


const commandeSchema=mongoose.Schema({
    utilisateur:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'utilisateur',
        required:true
    },
    plats:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plat',
        required:true
    }],
    dateCommande:{
        type:Date,
        default:Date.now,
        required:true
    },
    dateLivraison:{
        type:Date,
        required:true
    },
    etat:{
        type:String,
        enum:etat_enum,
        required:true,
        default:'nouveau'
    }
})

module.exports=mongoose.model('Commande',commandeSchema)