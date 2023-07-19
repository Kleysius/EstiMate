const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
    website_name: {
        type: String,
        required: true,
        default: 'Mon projet'
    },
    website_type: {
        type: String,
        required: true
    },
    mockup: {
        type: String,
        required: true
    },
    graphic_design: {
        type: String,
        required: true
    },
    customization: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    page_number: {
        type: String,
        required: true
    },
    special_pages: [{
        type: String
    }],
    multilingual: {
        type: String,
        required: true
    },
    language_count: {
        type: String,
        required: true
    },
    currency_conversion: {
        type: String,
        required: true
    },
    location_based_content: {
        type: String,
        required: true
    },
    third_party_services: [{
        type: String
    }],
    user_auth: {
        type: String,
        required: true
    },
    security_services: [{
        type: String
    }],
    project_budget: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    },
    website_examples: {
        type: String
    },
    support_pack: {
        type: String,
        required: true
    },
    total_price: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

const prices = {
    website_type: {
        'vitrine': 600,
        'ecommerce': 2000,
        'blog': 400,
        'portfolio': 700,
        'actualités': 800,
        'social': 2200,
        'forum': 1200,
        'éducatif': 1500,
        'emploi': 1200,
        'réservation': 2000,
        'e-learning': 1500,
    },
    mockup: {
        'oui': 400,
        'non': 0,
    },
    graphic_design: {
        'oui': 500,
        'non': 0,
    },
    customization: {
        'faible': 300,
        'moyen': 600,
        'élevé': 1000,
    },
    content: {
        'oui': 400,
        'non': 0,
    },
    page_number: {
        '1': 100,
        '2-5': 300,
        '5-10': 500,
        '10-20': 700,
        '20+': 1000,
    },
    special_pages: {
        'Portfolio': 200,
        'Témoignages': 150,
        'F.A.Q.': 100,
        'Boutique en ligne': 300,
        'Aucun': 0,
    },
    multilingual: {
        'oui': 100,
        'non': 0,
    },
    language_count: {
        '1': 0,
        '2-5': 100,
        '6-plus': 500,
    },
    currency_conversion: {
        'oui': 150,
        'non': 0,
    },
    location_based_content: {
        'oui': 100,
        'non': 0,
    },
    third_party_services: {
        'Outils analytiques': 100,
        'Services de marketing par email': 100,
        'Systèmes CRM': 300,
        'Intégration des médias sociaux': 150,
        'Systèmes de paiement en ligne': 250,
        'Outils de chat en direct': 200,
        'Services vidéo et audio': 300,
    },
    user_auth: {
        'oui': 300,
        'non': 0,
    },
    security_services: {
        'Certificat SSL': 100,
        'Authentification à deux facteurs': 200,
        'Protection DDoS': 300,
        'Cryptage des données': 200,
        'Protection intrusion pare-feu': 250,
        'Gestion des droits d\'accès': 200,
        'Sauvegardes régulières': 150,
        'Je ne sais pas': 0,
    },
    support_pack: {
        'Essentiel': 200,
        'Avancé': 400,
        'Premium': 600,
        'Aucun': 0,
    },
};

estimateSchema.methods.calculateTotalPrice = function () {
    let totalPrice = 0;

    totalPrice += prices.website_type[this.website_type] || 0;
    totalPrice += prices.mockup[this.mockup] || 0;
    totalPrice += prices.graphic_design[this.graphic_design] || 0;
    totalPrice += prices.customization[this.customization] || 0;
    totalPrice += prices.content[this.content] || 0;
    totalPrice += prices.page_number[this.page_number] || 0;

    for (let i = 0; i < this.special_pages.length; i++) {
        totalPrice += prices.special_pages[this.special_pages[i]] || 0;
    }

    totalPrice += prices.multilingual[this.multilingual] || 0;
    totalPrice += prices.language_count[this.language_count] || 0;
    totalPrice += prices.currency_conversion[this.currency_conversion] || 0;
    totalPrice += prices.location_based_content[this.location_based_content] || 0;

    for (let i = 0; i < this.third_party_services.length; i++) {
        totalPrice += prices.third_party_services[this.third_party_services[i]] || 0;
    }

    totalPrice += prices.user_auth[this.user_auth] || 0;

    for (let i = 0; i < this.security_services.length; i++) {
        totalPrice += prices.security_services[this.security_services[i]] || 0;
    }

    totalPrice += prices.support_pack[this.support_pack] || 0;

    this.total_price = totalPrice;
    return this.save();
};

const estimateModel = mongoose.model('estimate', estimateSchema);

module.exports = estimateModel;