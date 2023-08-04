const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
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
        'vitrine': 400,
        'ecommerce': 1600,
        'blog': 500,
        'portfolio': 600,
        'actualités': 600,
        'social': 1800,
        'forum': 1000,
        'éducatif': 1200,
        'emploi': 1000,
        'réservation': 2000,
        'e-learning': 1200,
    },
    mockup: {
        'oui': 200,
        'non': 0,
    },
    graphic_design: {
        'oui': 400,
        'non': 0,
    },
    customization: {
        'faible': 200,
        'moyen': 400,
        'élevé': 600,
    },
    content: {
        'oui': 200,
        'non': 0,
    },
    page_number: {
        '1': 100,
        '2-5': 250,
        '5-10': 400,
        '10-20': 650,
        '20+': 800,
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
        '6-plus': 300,
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
    // On initialise la variable totalPrice à 0 pour accumuler le coût total.
    const totalPrice = Object.entries(prices).reduce((acc, [category, values]) => {
        // On utilise Object.entries() pour transformer le tableau prices en un tableau de paires [clé, valeur].
        // Ensuite, on utilise la méthode reduce() pour itérer à travers chaque catégorie et sa valeur correspondante dans prices.

        if (category === 'special_pages' || category === 'third_party_services' || category === 'security_services') {
            // Pour les catégories spéciales (special_pages, third_party_services, security_services),
            // nous utilisons forEach() pour itérer à travers chaque élément du tableau correspondant dans l'objet this.

            this[category].forEach(item => {
                // On ajoute la valeur correspondante à l'accumulateur acc pour chaque élément du tableau.
                // Si la valeur n'existe pas dans prices, on ajoute 0 pour éviter une valeur NaN.

                acc += values[item] || 0;
            });
        } else {
            // Pour les autres catégories, on ajoute simplement la valeur correspondante à l'accumulateur acc.
            // Si la valeur n'existe pas dans prices, on ajoute 0 pour éviter une valeur NaN.

            acc += values[this[category]] || 0;
        }

        return acc; // On retourne l'accumulateur pour la prochaine itération.
    }, 0); // 0 est la valeur initiale de l'accumulateur.

    this.total_price = totalPrice; // On met à jour la propriété total_price de l'objet en cours avec le coût total calculé.
    return this.save(); // On sauvegarde l'objet en cours dans la base de données et on retourne une promesse.
};

const estimateModel = mongoose.model('estimate', estimateSchema);

module.exports = estimateModel;