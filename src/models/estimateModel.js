const mongoose = require("mongoose");

const estimateSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  website_name: {
    type: String,
    required: true,
    default: "Mon projet",
  },
  website_type: {
    type: String,
    required: true,
    default: "vitrine",
  },
  mockup: {
    type: String,
    required: true,
    default: "oui",
  },
  graphic_design: {
    type: String,
    required: true,
    default: "non",
  },
  customization: {
    type: String,
    required: true,
    default: "faible",
  },
  content: {
    type: String,
    required: true,
    default: "oui",
  },
  page_number: {
    type: String,
    required: true,
    default: "1",
  },
  special_pages: [
    {
      type: String,
      default: "Aucun",
    },
  ],
  multilingual: {
    type: String,
    required: true,
    default: "non",
  },
  language_count: {
    type: String,
    required: true,
    default: "1",
  },
  currency_conversion: {
    type: String,
    required: true,
    default: "non",
  },
  location_based_content: {
    type: String,
    required: true,
    default: "non",
  },
  third_party_services: [
    {
      type: String,
      default: "Outils analytiques",
    },
  ],
  user_auth: {
    type: String,
    required: true,
    default: "non",
  },
  security_services: [
    {
      type: String,
      default: "Je ne sais pas",
    },
  ],
  project_budget: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  website_examples: {
    type: String,
    default: "Aucun",
  },
  support_pack: {
    type: String,
    required: true,
    default: "Aucun",
  },
  total_price: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const prices = {
  website_type: {
    vitrine: 400,
    ecommerce: 1600,
    blog: 500,
    portfolio: 600,
    actualités: 600,
    social: 1800,
    forum: 1000,
    éducatif: 1200,
    emploi: 1000,
    réservation: 2000,
    "e-learning": 1200,
  },
  mockup: {
    oui: 200,
    non: 0,
  },
  graphic_design: {
    oui: 400,
    non: 0,
  },
  customization: {
    faible: 200,
    moyen: 400,
    élevé: 600,
  },
  content: {
    oui: 200,
    non: 0,
  },
  page_number: {
    1: 100,
    "2-5": 250,
    "5-10": 400,
    "10-20": 650,
    "20+": 800,
  },
  special_pages: {
    Portfolio: 200,
    Témoignages: 150,
    "F.A.Q.": 100,
    "Boutique en ligne": 300,
    Aucun: 0,
  },
  multilingual: {
    oui: 100,
    non: 0,
  },
  language_count: {
    1: 0,
    "2-5": 100,
    "6-plus": 300,
  },
  currency_conversion: {
    oui: 150,
    non: 0,
  },
  location_based_content: {
    oui: 100,
    non: 0,
  },
  third_party_services: {
    "Outils analytiques": 100,
    "Services de marketing par email": 100,
    "Systèmes CRM": 300,
    "Intégration des médias sociaux": 150,
    "Systèmes de paiement en ligne": 250,
    "Outils de chat en direct": 200,
    "Services vidéo et audio": 300,
  },
  user_auth: {
    oui: 300,
    non: 0,
  },
  security_services: {
    "Certificat SSL": 100,
    "Authentification à deux facteurs": 200,
    "Protection DDoS": 300,
    "Cryptage des données": 200,
    "Protection intrusion pare-feu": 250,
    "Gestion des droits d'accès": 200,
    "Sauvegardes régulières": 150,
    "Je ne sais pas": 0,
  },
  support_pack: {
    Essentiel: 200,
    Avancé: 400,
    Premium: 600,
    Aucun: 0,
  },
};

estimateSchema.methods.calculateTotalPrice = function () {
  let totalPrice = 0;

  for (const category in prices) {
    if (
      category === "special_pages" ||
      category === "third_party_services" ||
      category === "security_services"
    ) {
      this[category].forEach((item) => {
        totalPrice += prices[category][item] || 0;
      });
    } else {
      totalPrice += prices[category][this[category]] || 0;
    }
  }

  this.total_price = totalPrice;
  return this.save();
};

const estimateModel = mongoose.model("estimate", estimateSchema);

module.exports = estimateModel;

// estimateSchema.methods.calculateTotalPrice = function () {
//     const totalPrice = Object.entries(prices).reduce((acc, [category, values]) => {
//         if (category === 'special_pages' || category === 'third_party_services' || category === 'security_services') {
//             this[category].forEach(item => {
//                 acc += values[item] || 0;
//             });
//         } else {
//             acc += values[this[category]] || 0;
//         }
//         return acc;
//     }, 0);
//     this.total_price = totalPrice;
//     return this.save();
// };