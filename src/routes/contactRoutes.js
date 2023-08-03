const express = require('express');
const contactRouter = express.Router();
const contactModel = require('../models/contactModel.js');
const contactController = require('../controllers/contactController.js');

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
       contactController.createContact(req);
       await contactController.sendMail(req); 
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