// Importation des modules nécessaires
const express = require('express'); // Express est le cadre de travail du serveur web que nous utilisons
const session = require('express-session'); // Module pour gérer les sessions
const mongoose = require('mongoose'); // Mongoose est un ORM pour interagir avec MongoDB
const cookieParser = require('cookie-parser'); // Module pour analyser les cookies
const path = require('path'); // Module pour gérer les chemins de fichiers et de dossiers

// Importation des routeurs personnalisés
const mainRouter = require('./src/routes/mainRoutes.js') 
const registerRouter = require('./src/routes/registerRoutes.js');
const estimateRouter = require('./src/routes/estimateRoutes.js');
const contactRouter = require('./src/routes/contactRoutes.js');

// Charger le module dotenv pour gérer les variables d'environnement
require('dotenv').config();

// Initialiser une application Express
const app = express();

// Définir le chemin d'accès pour les vues (templates)
app.set('views', path.join(__dirname, '/src/views'));

// Middleware pour servir des fichiers statiques depuis le répertoire 'public'
app.use(express.static('public'));

// Middleware pour analyser les corps des requêtes JSON
app.use(express.json());

// Middleware pour analyser les corps des requêtes URL encodées
app.use(express.urlencoded({ extended: true }));

// Configuration du middleware de session
app.use(session({
    secret: process.env.SESSION_SECRET, // Clé secrète pour signer la session
    resave: false, // N'écrase pas la session à chaque requête si rien n'a changé
    saveUninitialized: true // Sauvegarde les sessions, même si elles sont non initialisées (n'ont pas de données)
}));

// Configuration du middleware pour analyser les cookies
app.use(cookieParser());

app.use(function(req, res, next) {
    res.locals.session = req.session;
    // req.session.userId = "64b4f702214a4cce267fbb23";
    next();
});

// Utiliser les routeurs personnalisés pour gérer les demandes vers certaines routes
app.use(mainRouter);
app.use(registerRouter);
app.use(estimateRouter);
app.use(contactRouter);

// Démarrer le serveur sur le port défini dans les variables d'environnement
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on port ${process.env.PORT}`);
    }
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Utilise le nouveau parseur d'URL de MongoDB pour éviter les avertissements de dépréciation
    useUnifiedTopology: true // Utilise la nouvelle gestion de la topologie pour éviter les avertissements de dépréciation
})
.then(() => console.log('Connected to MongoDB')) // Une fois connecté, affiche un message dans la console
.catch(error => console.log(error)); // En cas d'erreur lors de la connexion, affiche l'erreur dans la console