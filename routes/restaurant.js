const express = require('express')
const auth = require('./auth')

const router = express.Router();
const Restaurant = require('../models/restaurant')
const Utilisateur = require('../models/utilisateur')

router.get('', async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
        res.json(restaurants)
    }
    catch (err) {
        res.send('err=' + err)
    }
})

router.get('/getByUtilisateur', auth, async (req, res) => {
    try {
        const utilisateur = req.utilisateur
        const restaurant = await Restaurant.findOne({ responsable: utilisateur })
        res.json(restaurant)
    }
    catch (err) {
        res.send('err=' + err)
    }
})

router.get('/search/:nom', auth, async (req, res) => {
    try {
        const nom = req.params.nom
        const restaurants = await Restaurant.find({ nom: { $regex: '.*' + nom + '.*' } })
        res.json(restaurants)
    }
    catch (err) {
        res.send('err=' + err)
    }
})

router.post('/', auth, async (req, res) => {
    const id = req.body.utilisateur || req.utilisateur
    const utilisateur = await Utilisateur.findById(id)
    if ('admin' != utilisateur.type && 'restaurant' != utilisateur.type) return res.status(401).send('Action Forbidden')
    const restaurant = new Restaurant({
        nom: req.body.nom,
        responsable: utilisateur._id
    })
    try {
        const r = await restaurant.save()
        res.json(r)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

module.exports = router