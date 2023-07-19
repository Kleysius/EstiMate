const nodemailer = require('nodemailer');

require('dotenv').config();

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
    },
});

module.exports = transporter;