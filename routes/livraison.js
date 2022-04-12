const express = require('express')
const auth = require('./auth')

const router = express.Router();
const Livraison = require('../models/livraison')
const Utilisateur = require('../models/utilisateur')

router.get('/', auth, async (req, res) => {
    try {
        const livraisons = await Livraison.find()
        res.json(livraisons)
    }
    catch (err) {
        res.send('err=' + err)
    }
})

router.post('/', auth, async (req, res) => {
    let utilisateur = await Utilisateur.findById(req.utilisateur);
    console.log(utilisateur.type)
    if (utilisateur.type != 'admin') return res.status(401).send('Action forbidden')
    if (utilisateur.type == 'admin') utilisateur = req.body.utilisateur
    const livraison = new Livraison({
        commandes: req.body.commandes,
        livreur: req.utilisateur,
    })
    try {
        const l = await livraison.save()
        res.json(l)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

module.exports = router