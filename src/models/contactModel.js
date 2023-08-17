const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s-']+$/.test(value);
            },
            message: 'Le nom ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.'
        }
    },
    firstname: {
        type: String,
        required: false,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s-']+$/.test(value);
            },
            message: 'Le nom ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.'
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            message: 'L\'adresse email n\'est pas valide.'
        }
    },
    phone: {
        type: String,
        required: false,
        validate: {
            validator: function(value) {
                return /^0[1-9]([-. ]?[0-9]{2}){4}$/.test(value);
            },
            message: 'Le numéro de téléphone n\'est pas valide.'
        }
    },
    subject: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^[\s\p{P}\p{L}\d?!]{1,100}$/u.test(value);
            },
            message: 'Le sujet n\'est pas valide, il ne doit contenir que des lettres, des chiffres, des espaces, des apostrophes, des virgules et des tirets'
        }
    },
    message: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^[\s\p{P}\p{L}\d?!]{1,1000}$/u.test(value);
            },
            message: 'Le message n\'est pas valide, il ne doit contenir que des lettres, des chiffres, des espaces, des apostrophes, des virgules et des tirets'
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: String
    }
});

const contactModel = mongoose.model('contact', contactSchema);

module.exports = contactModel;