const contactModel = require('../models/contactModel.js');
const transporter = require('../middleware/mailer.js');

exports.createContact = async (req) => {
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
            throw err;
        }

        await newContact.save();
    } catch (error) {
        throw error;
    }
}

// Envoi du mail de l'utilisateur du site Estimate vers l'administrateur
exports.sendMail = async (req) => {
    let mailOptions = {
        from: 'EstiMate <' + process.env.GMAIL_USERNAME + '>',
        to: process.env.GMAIL_USERNAME,
        subject: 'Nouveau message de ' + req.body.name + ' ' + req.body.firstname,
        html:
            '<p>Vous avez reçu un nouveau message de ' + req.body.name + ' ' + req.body.firstname + '.</p><p>Adresse email : ' + req.body.email + '</p><p>Sujet : ' + req.body.subject + '</p><p>Message : ' + req.body.message + '</p>'
    }
    await transporter.sendMail(mailOptions);
    req.session.mailMessage = 'Votre message a bien été envoyé';
}