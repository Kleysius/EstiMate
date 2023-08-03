// On importe les modules nécessaires
const express = require('express');
const mainRouter = express.Router();
const userModel = require('../models/userModel.js');
const estimateModel = require('../models/estimateModel.js');
const contactModel = require('../models/contactModel.js');
const fs = require('fs');
const path = require('path');

// Définition de la route pour la page d'accueil
mainRouter.get('/', (req, res) => {
    try {
        // On utilise la méthode 'render' pour rendre le fichier 'home.twig' situé dans le dossier 'pages'
        res.render('pages/home.twig');
    } catch (error) {
        // S'il y a une erreur, on l'affiche dans la console
        console.log(error);
    }
});

// Définition de la route pour le tableau de bord
mainRouter.get('/dashboard', async (req, res) => {
    try {
        let estimateIdSent = req.session.estimateIdSent;

        // On cherche l'utilisateur dans la base de données avec l'ID stocké dans la session
        let user = await userModel.findOne({ _id: req.session.userId });

        // On cherche l'estimation associée à cet utilisateur
        let estimates = await estimateModel.find({ user: req.session.userId });

        // Chercher tous les messages de contact associés à cet utilisateur
        let messages = await contactModel.find({ userId: req.session.userId });

        // Création des tableaux pour les noms des projets et leurs coûts totaux
        let projectNames = [];
        let totalCosts = [];

        // Remplissage des tableaux
        for (let estimate of estimates) {
            projectNames.push(estimate.website_name);
            totalCosts.push(estimate.total_price);
        }

        // Déterminer le message de bienvenue à afficher
        let welcomeMessage;
        if (req.cookies.visited) {
            welcomeMessage = 'Ça fait plaisir de vous revoir';
        } else {
            res.cookie('visited', true, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
            welcomeMessage = 'Bienvenue';
        }

        const avatarsDirectory = path.join(__dirname, '../../public/avatars');
        fs.readdir(avatarsDirectory, (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erreur lors de la lecture du répertoire des avatars');
            } else {
                const avatars = files.map(file => path.join('avatars', file));

                // On envoie les données de l'utilisateur et de l'estimation à la vue 'dashboard.twig'
                res.render('pages/dashboard.twig', {
                    user: user,
                    estimates: estimates,
                    estimateIdSent: estimateIdSent,
                    messages: messages,
                    avatars: avatars,
                    projectNames: projectNames,
                    totalCosts: totalCosts,
                    welcomeMessage: welcomeMessage
                });
            }
        });
    } catch (error) {
        // S'il y a une erreur, on l'affiche dans la console
        console.log(error);
    }
});

// Route pour obtenir les estimations pour le graphique
mainRouter.get('/dashboard/estimates', async (req, res) => {
    try {
        // Trouvez l'estimation associée à cet utilisateur
        let estimates = await estimateModel.find({ user: req.session.userId });

        // Création des tableaux pour les noms des projets et leurs coûts totaux
        let projectNames = [];
        let totalCosts = [];

        // Remplissage des tableaux
        for (let estimate of estimates) {
            projectNames.push(estimate.website_name);
            totalCosts.push(estimate.total_price);
        }

        // Renvoyer les données au format JSON
        res.json({ projectNames: projectNames, totalCosts: totalCosts });
    } catch (error) {
        // S'il y a une erreur, envoyez un statut d'erreur 500 et l'erreur
        console.log(error);
        res.status(500).send(error);
    }
});

mainRouter.get('/result', async (req, res) => {
    try {
        // On cherche l'estimation la plus récente associée à cet utilisateur
        let latestEstimate = await estimateModel.findOne({ user: req.session.userId }).sort({ createdAt: -1 });

        if (!latestEstimate) {
            res.redirect('/estimate');
        }

        // On utilise la méthode 'render' pour rendre le fichier 'result.twig' situé dans le dossier 'pages'
        res.render('pages/result.twig', { estimate: latestEstimate });
    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

// Mise à jour du compte
mainRouter.post('/update_account/:id', async (req, res) => {
    try {
        // On cherche l'utilisateur dans la base de données avec l'ID passé en paramètre
        let user = await userModel.findById(req.params.id, { password: 0, confirmPassword: 0 });

        // On met à jour les données de l'utilisateur
        user.avatar = req.body.avatar;
        user.name = req.body.name;
        user.firstname = req.body.firstname;
        user.email = req.body.email;

        // On sauvegarde les modifications
        await user.save();

        // On redirige l'utilisateur vers le tableau de bord
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

// Définition de la route pour le formulaire d'estimation
mainRouter.get('/estimate', (req, res) => {
    try {

        // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
        if (!req.session.userId) {
            res.redirect('/register');
        } else {
            // On utilise la méthode 'render' pour rendre le fichier 'estimate.twig' situé dans le dossier 'pages'
            res.render('pages/estimate.twig');
        }
    } catch (error) {
        console.log(error);
    }
});

// Définition de la route pour la page à propos
mainRouter.get('/about', (req, res) => {
    try {
        res.render('pages/about.twig');
    } catch (error) {
        console.log(error);
    }
});

// Définition de la route pour la faq
mainRouter.get('/faq', (req, res) => {
    try {
        res.render('pages/faq.twig');
    } catch (error) {
        console.log(error);
    }
});

// Conditions générales d'utilisation
mainRouter.get('/terms', (req, res) => {
    try {
        res.render('pages/terms.twig');
    } catch (error) {
        console.log(error);
    }
});

// On exporte le routeur pour pouvoir l'utiliser dans notre application principale
module.exports = mainRouter;