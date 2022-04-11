const express = require('express')
const auth = require('./auth')

const router = express.Router();
const Plat = require('../models/plat')
const multer = require('multer');
const plat = require('../models/plat');
var upload = multer({ dest: 'uploads/' })

router.get('/', async (req, res) => {
    try {
        const plats = await Plat.find({ etat: true }).populate('restaurant')
        res.json(plats)
    }
    catch (err) {
        res.send('err=' + err)
    }
})

router.get('/getByResto/:restaurant', async (req, res) => {
    try {
        const restaurant = req.params['restaurant'];
        const plats = await Plat.find({ restaurant: restaurant, etat: true }).populate('restaurant')
        res.json(plats)
    }
    catch (err) {
        res.send('err=' + err)
    }
});

router.get('/search/:nom', async (req, res) => {
    try {
        const nom = req.params.nom;
        const plats = await Plat.find({ nom: { $regex: '.*' + nom + '.*' }, etat: true }).populate('restaurant')

        res.json(plats)
    }
    catch (err) {
        res.send('err=' + err)
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const id = req.params['id'];
        const etat = false;
        let plat = await Plat.findOneAndUpdate({ _id: id }, { etat: etat });
        const new_plat = new Plat({
            nom: req.body.plat.nom,
            prix: req.body.plat.prix,
            restaurant: req.body.plat.restaurant,
            etat: true
        })
        plat = new_plat.save()
        res.json(plat)
    }
    catch (err) {
        res.send('err=' + err)
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params['id'];
        const etat = false;
        let plat = await Plat.findOneAndUpdate({ _id: id }, { etat: etat });
        res.json(plat)
    }
    catch (err) {
        res.send('err=' + err)
    }
});

router.post('/', auth, async (req, res) => {
    const plat = new Plat({
        nom: req.body.nom,
        prix: req.body.prix,
        restaurant: req.body.restaurant
    })
    try {
        const p = await plat.save()
        res.json(p)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})


router.post('/images/upload', upload.single('myFile'), async (req, res, next) => {
    console.log(req.file)
})


module.exports = router