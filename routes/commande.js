const express = require('express')
const auth = require('./auth')

const router = express.Router();
const Commande = require('../models/commande')
const Restaurant = require('../models/restaurant')
const Plat = require('../models/plat');
const Utilisateur = require('../models/utilisateur');
const restaurant = require('../models/restaurant');
router.get('/', auth, async (req, res) => {
    try {
        let etat = '';
        let utilisateur = await Utilisateur.findOne({ _id: req.utilisateur });
        console.log('utilisateur====>', utilisateur._id)
        if (utilisateur.type == 'restaurant') etat = 'nouveau'
        if (utilisateur.type == 'admin') etat = 'pret'
        if (utilisateur.type == 'livreur') etat = 'encours'
        console.log('type', utilisateur.type)
        // filter by etat
        const query = Commande.find()
            .where('etat').equals(etat)
        console.log('etat', etat);
        // filter commande of the resto
        if (utilisateur.type == 'restaurant') {
            const resto = await Restaurant.findOne({ responsable: req.utilisateur._id })
            const plats = await Plat.find({ restaurant: resto._id });
            query.where('plats.plat', { $in: plats })
        }
        if (utilisateur.type == 'utilisateur') {
            query.where('utilisateur').equals(utilisateur._id);
            query.where({ 'etat': { $ne: 'fini' } })
        }

        // popupulate
        query.populate('plats.plat')
            .populate({ path: 'utilisateur', select: '_id nom' });
        const commandes = await query.exec()
        console.log('com', commandes)

        res.json(commandes);
    }
    catch (err) {
        console.log(err)
        res.send('err=' + err)
    }
})

router.post('/', auth, async (req, res) => {
    let commandes = req.body.plats
    let commandeSplit = [];
    for (c of commandes) {
        let r = (await Plat.findOne({ _id: c.plat })).restaurant
        let ctemp = { plat: c.plat, nb: c.nb }
        if (commandeSplit.find(x => x.restaurant.equals(r))) {
            let index = commandeSplit.findIndex(x => x.restaurant.equals(r));
            commandeSplit[index].commandes.push(ctemp);
        } else {
            commandeSplit.push({ restaurant: r, commandes: [ctemp] })
        }
    }

    try {
        for (c of commandeSplit) {
            const commande = new Commande({
                utilisateur: req.utilisateur._id,
                plats: c.commandes,
                dateLivraison: req.body.dateLivraison,
                etat: req.body.etat
            });
            const p = await commande.save()
        }
        res.json(200);
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.put('/', auth, async (req, res) => {
    try {
        let commande = await Commande.findOneAndUpdate(
            { _id: req.body.id },
            { etat: req.body.etat });
        res.json(commande)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.put('/bulk', auth, async (req, res) => {
    console.log('bulkk....>>>>>>>>>>>>>>>>')
    try {
        let c_id = req.body.commandes
        let commandes = await Commande.updateMany({ _id: { $in: c_id } }, { etat: 'encours' })
        res.json(commandes)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.get('/agregate', auth, async (req, res) => {
    try {
        let utilisateur = await Utilisateur.findOne({ _id: req.utilisateur });
        if (utilisateur.type != 'admin' && utilisateur.type != 'restaurant') {
            return res.status(501).send('forbidden')
        }

        let resto_id = req.query.restaurant;
        if (utilisateur.type == 'restaurant') {
            resto_id = (await Restaurant.findOne({ responsable: utilisateur._id }))._id
        }
        let query = Commande.find()
        query.populate({ path: 'plats.plat', model: 'Plat' })
        const plats = await Plat.find({ restaurant: resto_id });
        query.where('plats.plat', { $in: plats })
        let commandes = await query.exec()
        let cs = []
        commandes.map(c => {
            let somme = 0;
            c.plats.forEach(plts => {
                somme += plts.nb * plts.plat.prix
            });
            cs.push({ _id: c._id, dateCommande: c.dateCommande, somme: somme });
        });

        let val = []
        cs.forEach(commande => {
            let date = commande.dateCommande.toLocaleString().slice(0, 10)
            let index = val.indexOf(val.find(x => x.date == date))
            console.log('index', index)
            if (index >= 0) {
                val[index].somme += commande.somme
            }
            else {
                val.push({ date: date, somme: commande.somme })
            }
        })
        res.status(200).json(val)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})
module.exports = router