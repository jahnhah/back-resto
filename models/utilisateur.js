const mongoose=require('mongoose')

enum_utilisateur=['utilisateur','restaurant','admin','livreur']
const utilisateurSchema=mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pwd:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:enum_utilisateur,
        required:true,
    }

})

module.exports=mongoose.model('Utilisateur',utilisateurSchema)