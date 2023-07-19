const express = require('express');
const estimateRouter = express.Router();
const estimateModel = require('../models/estimateModel.js');
const userModel = require('../models/userModel.js');
const transporter = require('../middleware/mailer.js');
const twig = require('twig');

estimateRouter.post('/submit-estimation', async (req, res) => {
    try {
        const newEstimate = new estimateModel(req.body);

        // Vérifier si l'utilisateur est inscrit
        if (req.session.userId) {
            // Si l'utilisateur est inscrit, utilisez cet identifiant
            const user = await userModel.findById(req.session.userId);
            newEstimate.user = user._id;
        }

        await newEstimate.calculateTotalPrice();
        await newEstimate.save();
        res.redirect('/dashboard');
    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

estimateRouter.get('/delete_estimation/:id', async (req, res) => {
    try {
        await estimateModel.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

estimateRouter.get('/send_estimation/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.session.userId);
        const estimate = await estimateModel.findById(req.params.id);
        let date = new Date(estimate.date);
        date = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

        twig.renderFile('src/views/layouts/email_template.twig', { estimate: estimate, date: date, user: user }, async function (err, html) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                const mailOptions = {
                    from: 'sebasti.thomass@gmail.com',
                    to: user.email,
                    subject: `Votre estimation pour le projet ${estimate.website_name}`,
                    html: html
                };

                await transporter.sendMail(mailOptions);
                req.session.estimateIdSent = estimate._id;
                res.status(200);
                res.json({ message: 'Email sent' });
            }
        });
    } catch (error) {
        res.status(400)
        res.send(error);
        console.log(error);
    }
});


module.exports = estimateRouter;