const express = require('express');
const registerRouter = express.Router();
const userModel = require('../models/userModel.js');
const estimateModel = require('../models/estimateModel.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

registerRouter.get('/register', (req, res) => {
    try {
        const avatarsDirectory = path.join(__dirname, '../../public/avatars');
        fs.readdir(avatarsDirectory, (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erreur lors de la lecture du répertoire des avatars');
            } else {
                const avatars = files.map(file => path.join('avatars', file));
                res.render('pages/register.twig', { avatars });
            }
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

registerRouter.post('/register', async (req, res) => {
    try {
        const newUser = new userModel(req.body);

        let err = newUser.validateSync();

        if (err) {
            res.render('pages/register.twig', { error: err.errors, user: req.body });
            return;
        }

        await newUser.save();

        req.session.userId = newUser._id;

        // Recherche de l'estimation associée à l'ID de session
        const estimate = await estimateModel.findOne({ user: req.session.userId });

        if (estimate) {
            estimate.user = newUser._id;
            await estimate.save();
        }

        res.redirect('/estimate');
    } catch (error) {
        console.log(error);
        res.render('pages/register.twig', { error: error });
    }
});

// route pour se connecter
registerRouter.post('/login', async (req, res) => {
    try {
        let errors = {};
        let user = await userModel.findOne({ email: req.body.email });
        if (user) {
            let result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                req.session.userId = user._id;
                res.redirect('/dashboard');
            } else {
                errors.loginPassword = 'Mot de passe incorrect';
                throw errors;
            }
        } else {
            errors.loginEmail = 'Email incorrect ou inexistant';
            throw errors;
        }
    } catch (error) {
        console.log(error);
        res.render('pages/register.twig', { error: error });
    }
});

// route pour se déconnecter
registerRouter.get('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

module.exports = registerRouter;