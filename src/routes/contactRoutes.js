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

contactRouter.post('/contactUs', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const newMessage = new contactModel({
            name,
            email,
            phone,
            message,
            "subject": "Contact visiteur",
        });

        const validationError = newMessage.validateSync();
        console.log(validationError);
        if (validationError) {
            res.render('pages/contact.twig', { error: validationError.errors });
            return;
        }

        await contactController.sendMail(req);

        res.redirect('/contact');
    } catch (error) {
        console.log(error);
        res.render('pages/contact.twig', { error: error });
    }
});

module.exports = contactRouter;