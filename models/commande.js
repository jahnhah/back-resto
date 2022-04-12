const { number, string } = require("joi");
const { Timestamp } = require("mongodb")
const mongoose = require('mongoose')
const Utilisateur = require("./utilisateur")
const Plat = require("./plat")
// client -> resto -> livreur -> fini
let etat_enum = ["nouveau", "pret", "encours", "fini"];


const commandeSchema = mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    plats: [{
        plat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plat',
            required: true
        }, nb: {
            type: Number,
            default: 1,
            required: true
        }
    }],
    dateCommande: {
        type: Date,
        default: Date.now(),
        required: true
    },
    dateLivraison: {
        type: Date,
        required: true
    },
    etat: {
        type: String,
        enum: etat_enum,
        required: true,
        default: 'nouveau'
    }
})



module.exports = mongoose.model('Commande', commandeSchema)