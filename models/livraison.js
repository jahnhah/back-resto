const mongoose=require('mongoose')
const Utilisateur = require('./utilisateur')

const livraisonSchema=mongoose.Schema({
    commandes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'commande',
        required:true
    }],
    livreur:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'utilisateur',
        required:true
    }
})

module.exports=mongoose.model('Livraison',livraisonSchema)