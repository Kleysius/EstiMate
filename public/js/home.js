// Cette fonction génère un nombre aléatoire entre les deux limites fournies (min et max).
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Cette classe représente une palette de couleurs basée sur une couleur de base et deux couleurs complémentaires.
class ColorPalette {
    // Le constructeur initialise la palette de couleurs en définissant les couleurs et en appliquant ces couleurs comme propriétés personnalisées CSS.
    constructor() {
        this.setColors();
        this.setCustomProperties();
    }

    // Cette méthode définit les couleurs de la palette.
    // Une teinte aléatoire est choisie pour la couleur de base, et une teinte complémentaires est déterminée en ajoutant 60 à la teinte de la couleur de base.
    setColors() {
        // choisir une teinte aléatoire entre 220 et 360 pour la couleur de base
        this.hue = Math.floor(random(220, 360));
        // déterminer la teinte de la couleur complémentaire en ajoutant 60 à la teinte de la couleur de base
        this.complimentaryHue = this.hue + 60;
    }

    // Cette méthode applique les teintes de couleur de la palette en tant que propriétés personnalisées CSS. 
    // Cela permet d'utiliser les teintes définies dans le reste de l'interface utilisateur.
    setCustomProperties() {
        document.documentElement.style.setProperty("--hue", this.hue);
        document.documentElement.style.setProperty("--hue-complimentary", this.complimentaryHue);
    }
}

const colorPalette = new ColorPalette();

document.querySelector(".overlay-button-colors").addEventListener("click", () => {
    colorPalette.setColors();
    colorPalette.setCustomProperties();
});


// Mur de logo
const logoWall = document.querySelector(".logo-wall");
const logo = logoWall.querySelector("img");
// Définir le nombre de répétitions du logo le long de l'axe horizontal (à gauche et à droite)
const numCopiesX = 30;
// Définir le nombre de répétitions du logo le long de l'axe vertical (en haut et en bas)
const numCopiesY = 30;
// Définir la distance maximale que le mur de logo peut se déplacer horizontalement en réponse aux mouvements de la souris
const maxTranslateX = 10;
// Définir la distance maximale que le mur de logo peut se déplacer verticalement en réponse aux mouvements de la souris
const maxTranslateY = 10;

// Créer des copies du logo et les ajouter au mur de logo pour obtenir l'effet de répétition
for (let y = 0; y < numCopiesY; y++) {
    for (let x = 0; x < numCopiesX; x++) {
        const copy = logo.cloneNode(true);
        logoWall.appendChild(copy);
    }
}

// Fonction qui met à jour la position du mur de logo en réponse aux mouvements de la souris
function updateLogoWallPosition(event) {
    // Obtenir les coordonnées horizontales (clientX) et verticales (clientY) de la position de la souris
    const { clientX, clientY } = event;
    // Obtenir la largeur de la fenêtre du navigateur
    const windowWidth = window.innerWidth;
    // Obtenir la hauteur de la fenêtre du navigateur
    const windowHeight = window.innerHeight;
    // Normaliser les coordonnées horizontales de la souris pour les convertir en valeurs entre -1 et 1
    const normalizedX = (clientX / windowWidth) * 2 - 1;
    // Normaliser les coordonnées verticales de la souris pour les convertir en valeurs entre -1 et 1
    const normalizedY = (clientY / windowHeight) * 2 - 1;
    // Calculer le déplacement horizontal du mur de logo en fonction du mouvement de la souris
    const translateX = maxTranslateX * normalizedX;
    // Calculer le déplacement vertical du mur de logo en fonction du mouvement de la souris
    const translateY = maxTranslateY * normalizedY;
    // Appliquer les déplacements calculés au mur de logo en modifiant la propriété CSS "transform"
    logoWall.style.transform = `translate(${translateX}px, ${translateY}px)`;
}

window.addEventListener("mousemove", updateLogoWallPosition);

// Cookie Consent
const cookieBox = document.querySelector(".wrapper");
const buttons = document.querySelectorAll(".cookie-button");

const executeCodes = () => {
    if (document.cookie.includes("estimate")) return;
    cookieBox.classList.add("show");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            cookieBox.classList.remove("show");

            if (button.id == "acceptBtn") {
                // set cookies for 1 month. 60 = 1 min, 60 = 1 hours, 24 = 1 day, 30 = 30 days
                document.cookie = "cookieBy= estimate; max-age=" + 60 * 60 * 24 * 30;
            }
        });
    });
};

window.addEventListener("load", executeCodes);

ScrollReveal().reveal('header', {
    delay: 200,
    duration: 1000,
    origin: 'top',
    distance: '100px',
    reset: true
});

ScrollReveal().reveal('footer', {
    delay: 400,
    duration: 1000,
    origin: 'bottom',
    distance: '100px',
    reset: true
});

ScrollReveal().reveal('.overlay-container', {
    delay: 600,
    duration: 1500,
    origin: 'bottom',
    distance: '100px',
    reset: true
});