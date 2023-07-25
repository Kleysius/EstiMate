const express = require('express');
const contactRouter = express.Router();
const userModel = require('../models/userModel.js');
const contactModel = require('../models/contactModel.js');
const transporter = require('../middleware/mailer.js');

// Définition de la route pour la page contact
contactRouter.get('/contact', (req, res) => {
    try {
        res.render('pages/contact.twig');
    } catch (error) {
        console.log(error);
    }
});

// Route post pour le formulaire de contact
contactRouter.post('/contact', async (req, res) => {
    try {
        const newContact = new contactModel({
            ...req.body,
            status: 'pending'
        });

        if (req.session.userId) {
            newContact.userId = req.session.userId;
        }

        let err = newContact.validateSync();

        if (err) {
            console.log(err);
            res.render('pages/dashboard.twig', { error: err.errors });
            return;
        }

        await newContact.save();

        // Envoi du mail de l'utilisateur du site Estimate vers l'administrateur
        let mailOptions = {
            from: 'EstiMate <' + process.env.GMAIL_USERNAME + '>',
            to: process.env.GMAIL_USERNAME,
            subject: 'Nouveau message de ' + req.body.name + ' ' + req.body.firstname,
            html:
                '<p>Vous avez reçu un nouveau message de ' + req.body.name + ' ' + req.body.firstname + '.</p><p>Adresse email : ' + req.body.email + '</p><p>Sujet : ' + req.body.subject + '</p><p>Message : ' + req.body.message + '</p>'
        }

        await transporter.sendMail(mailOptions);
        req.session.mailMessage = 'Votre message a bien été envoyé';
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('pages/dashboard.twig', { error: error });
    }
});

// Route pour supprimer un message de la base de données
contactRouter.delete('/contact/delete-message/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        await contactModel.deleteOne({ _id: messageId });
        req.session.deleteMessage = 'Le message a été supprimé avec succès';
        res.status(200).json({ message: "Message successfully deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});


module.exports = contactRouter;