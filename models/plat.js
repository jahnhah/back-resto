const mongoose = require('mongoose')
const Restaurant = require('./restaurant')

const platSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    etat: {
        type: Boolean,
        default: true,
        required: true
    }
    // image
})

module.exports = mongoose.model('Plat', platSchema)