const express = require('express')

const router = express.Router();
const Utilisateur = require('../models/utilisateur')
const { registerValidation, loginValidation } = require('../utils/validation')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('./auth')
const { sendEmail } = require('../utils/handlebars')
dotenv.config()

router.get('', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.find()
        res.json(utilisateur)
    }
    catch (err) {
        res.send('err=' + err)
    }
})

router.get('/getByType?:type', auth, async (req, res) => {
    try {
        const type = req.params['type'];
        const utilisateurs = await Utilisateur.find({ type: 'livreur' });
        utilisateurs.forEach(e => {
            e.pwd = '';
        });
        res.json(utilisateurs)
    }
    catch (err) {
        res.send('err=' + err)
    }
})
router.post('/newsletter', async (req, res) => {
    try {
        let mail = req.body.mail;
        sendEmail(mail);
        res.status(200).json({ status: 'OK' });
    }
    catch (err) {
        console.log(err)
    }

})


router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashed_pwd = await bcrypt.hash(req.body.pwd, salt);
    const utilisateur = new Utilisateur({
        nom: req.body.nom,
        email: req.body.email,
        type: req.body.type,
        pwd: hashed_pwd
    })

    try {
        const emailExist = await Utilisateur.findOne({ email: req.body.email });
        // check email
        if (emailExist) return res.status(400).send('Email déja inscrit')
        // Validation
        const { error } = registerValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        // Save the user
        const u = await utilisateur.save()
        const token = jwt.sign({ _id: u._id }, process.env.SECRET_TOKEN)
        res.header('auth-token', token).json({ 'token': token })
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/login', async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ email: req.body.email });
    // check email
    if (!utilisateur) return res.status(400).send('Email does not exist')
    // Validation
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    // check password
    const compare_pwd = await bcrypt.compare(req.body.pwd, utilisateur.pwd)
    if (!compare_pwd) return res.status(400).send('Wrong password')
    // sign token
    const token = jwt.sign({ _id: utilisateur._id }, process.env.SECRET_TOKEN)
    res.header('auth-token', token).json({ 'token': token, 'type': utilisateur.type })
})

module.exports = router