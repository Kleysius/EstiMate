// PIXI.js est une bibliothèque JavaScript qui permet de créer des animations et des graphiques 2D à l'aide de WebGL
import * as PIXI from "https://cdn.skypack.dev/pixi.js@5.x";
// filter-kawase-blur est un filtre PixiJS qui permet de créer un effet de flou
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur@3.2.0";
// SimplexNoise est une bibliothèque JavaScript qui permet de générer du bruit simplex
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.0";
// hsl-to-hex est une bibliothèque JavaScript qui permet de convertir des couleurs HSL en couleurs hexadécimales
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
// debounce est une bibliothèque JavaScript qui permet de limiter le nombre d'appels à une fonction
import debounce from "https://cdn.skypack.dev/debounce";

// Quand la page est chargée, exécute le code suivant
window.addEventListener("load", () => {
    // Cette fonction génère un nombre aléatoire entre les deux limites fournies (min et max).
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Cette fonction cartographie (map) un nombre d'une plage de valeurs à une autre.
    // Elle prend cinq arguments : un nombre 'n' et deux paires de valeurs de début et de fin qui représentent les plages de valeurs.
    // Par exemple, si vous voulez cartographier un nombre de la plage 0-100 à la plage 0-1, vous utiliseriez map comme suit : map(n, 0, 100, 0, 1)
    function map(n, start1, end1, start2, end2) {
        return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
    }

    // Crée une nouvelle instance de l'algorithme de bruit simplex. 
    // Le bruit simplex est un algorithme utilisé pour générer du bruit en fonction de coordonnées, ce qui peut être utile pour diverses applications comme la génération de terrains.
    const simplex = new SimplexNoise();

    // Cette classe représente une palette de couleurs basée sur une couleur de base et deux couleurs complémentaires.
    class ColorPalette {
        // Le constructeur initialise la palette de couleurs en définissant les couleurs et en appliquant ces couleurs comme propriétés personnalisées CSS.
        constructor() {
            this.setColors();
            this.setCustomProperties();
        }

        // Cette méthode définit les couleurs de la palette.
        // Une teinte aléatoire est choisie pour la couleur de base, et deux teintes complémentaires sont déterminées en ajoutant 30 et 60 à la teinte de la couleur de base.
        // Les couleurs sont ensuite converties en hexadécimal à l'aide de la fonction hsl et stockées dans la propriété colorChoices.
        setColors() {
            // choisir une teinte aléatoire entre 220 et 360 pour la couleur de base
            this.hue = ~~random(220, 360);
            // déterminer les teintes des couleurs complémentaires en ajoutant 30 et 60 à la teinte de la couleur de base
            this.complimentaryHue1 = this.hue + 30;
            this.complimentaryHue2 = this.hue + 60;

            // définir une saturation et une luminosité fixes pour les couleurs
            this.saturation = 95;
            this.lightness = 50;

            // convertir les couleurs HSL en hexadécimal et les stocker dans colorChoices
            this.baseColor = hsl(this.hue, this.saturation, this.lightness);
            this.complimentaryColor1 = hsl(this.complimentaryHue1, this.saturation, this.lightness);
            this.complimentaryColor2 = hsl(this.complimentaryHue2, this.saturation, this.lightness);

            // stocker les choix de couleurs dans un tableau pour une utilisation ultérieure
            this.colorChoices = [this.baseColor, this.complimentaryColor1, this.complimentaryColor2];
        }

        // Cette méthode retourne une couleur aléatoire de la palette de couleurs. 
        // Elle choisit un indice aléatoire du tableau colorChoices, convertit la valeur de couleur en hexadécimal pour PixiJS et la retourne.
        randomColor() {
            return this.colorChoices[~~random(0, this.colorChoices.length)].replace("#", "0x");
        }

        // Cette méthode applique les teintes de couleur de la palette en tant que propriétés personnalisées CSS. 
        // Cela permet d'utiliser les teintes définies dans le reste de l'interface utilisateur.
        setCustomProperties() {
            document.documentElement.style.setProperty("--hue", this.hue);
            document.documentElement.style.setProperty("--hue-complimentary1", this.complimentaryHue1);
            document.documentElement.style.setProperty("--hue-complimentary2", this.complimentaryHue2);
        }
    }

    // Orb class
    class Orb {
        // Le constructeur initialise un objet Orb avec des valeurs par défaut pour ses attributs. 
        // Il crée un objet PIXI.Graphics qui est utilisé pour dessiner l'orb dans une application PIXI.js.
        constructor(fill = 0x000000) {
            // Définit les limites de déplacement de l'orb
            this.bounds = this.setBounds();

            // Initialise la position de l'orb à un point aléatoire dans les limites
            this.x = random(this.bounds["x"].min, this.bounds["x"].max);
            this.y = random(this.bounds["y"].min, this.bounds["y"].max);

            // Initialise la taille et la couleur de l'orb
            this.scale = 1;
            this.fill = fill;

            // Définit le rayon de l'orb et génère des valeurs de bruit initial pour le mouvement de l'orb
            this.radius = random(window.innerHeight / 6, window.innerHeight / 3);
            this.xOff = random(0, 1000);
            this.yOff = random(0, 1000);
            this.inc = 0.002;

            // Crée un objet PIXI.Graphics pour dessiner l'orb
            this.graphics = new PIXI.Graphics();
            this.graphics.alpha = 0.825;

            // Ajoute un gestionnaire d'événements pour redéfinir les limites de déplacement de l'orb lorsque la fenêtre est redimensionnée
            window.addEventListener(
                "resize",
                debounce(() => {
                    this.bounds = this.setBounds();
                }, 250)
            );
        }

        // Cette méthode définit les limites de déplacement de l'orb en fonction de la taille de la fenêtre.
        setBounds() {
            // Détermine la distance maximale que l'orb peut parcourir à partir de son origine
            const maxDist = window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;

            // Définit l'origine de l'orb
            const originX = window.innerWidth / 1.25;
            const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 1.375;

            // Retourne un objet représentant les limites de déplacement de l'orb
            return {
                x: {
                    min: originX - maxDist,
                    max: originX + maxDist
                },
                y: {
                    min: originY - maxDist,
                    max: originY + maxDist
                }
            };
        }

        // Cette méthode met à jour la position et la taille de l'orb en utilisant du bruit simplex.
        update() {
            // Génère des valeurs de bruit pour chaque axe de mouvement et l'échelle de l'orb
            const xNoise = simplex.noise2D(this.xOff, this.xOff);
            const yNoise = simplex.noise2D(this.yOff, this.yOff);
            const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

            // Cartographie les valeurs de bruit à des points dans les limites de l'orb
            this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
            this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
            this.scale = map(scaleNoise, -1, 1, 0.5, 1);

            // Met à jour les valeurs de bruit pour la prochaine itération
            this.xOff += this.inc;
            this.yOff += this.inc;
        }

        // Cette méthode met à jour l'apparence de l'orb dans l'objet PIXI.Graphics.
        render() {
            // Met à jour la position et l'échelle de l'orb dans l'objet PIXI.Graphics
            this.graphics.x = this.x;
            this.graphics.y = this.y;
            this.graphics.scale.set(this.scale);

            // Efface tout dessin précédent dans l'objet PIXI.Graphics
            this.graphics.clear();

            // Définit la couleur de remplissage pour le prochain dessin
            this.graphics.beginFill(this.fill);

            // Dessine un cercle représentant l'orb
            this.graphics.drawCircle(0, 0, this.radius);

            // Signale à l'objet PIXI.Graphics que nous avons terminé le dessin
            this.graphics.endFill();
        }
    }

    // Ce code crée une nouvelle application PIXI.js.
    // Il s'adapte automatiquement à la taille de la fenêtre du navigateur et 
    // utilise un fond transparent pour permettre un fond de dégradé avec CSS.
    const app = new PIXI.Application({
        view: document.querySelector(".orb-canvas"),
        resizeTo: window,
        transparent: true
    });

    // Applique un filtre de flou à l'ensemble de la scène de l'application pour ajouter un effet d'esthétisme
    app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

    // Crée une nouvelle palette de couleurs pour les orbes
    const colorPalette = new ColorPalette();

    // Crée un tableau pour stocker les orbes et initialise 10 orbes avec des couleurs aléatoires
    const orbs = [];
    for (let i = 0; i < 10; i++) {
        const orb = new Orb(colorPalette.randomColor());
        app.stage.addChild(orb.graphics);
        orbs.push(orb);
    }

    // Ajoute une animation à chaque orbe si l'utilisateur n'a pas choisi de réduire le mouvement 
    // dans leurs préférences du système d'exploitation.
    // Si l'utilisateur a choisi de réduire le mouvement, les orbes seront simplement affichés sans animation.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        app.ticker.add(() => {
            orbs.forEach((orb) => {
                orb.update();
                orb.render();
            });
        });
    } else {
        orbs.forEach((orb) => {
            orb.update();
            orb.render();
        });
    }

    // Ajoute un gestionnaire d'événements au bouton qui permet à l'utilisateur de changer les couleurs des orbes 
    // lorsque le bouton est cliqué.
    document
        .querySelector(".overlay-button-colors")
        .addEventListener("click", () => {
            colorPalette.setColors();
            colorPalette.setCustomProperties();

            orbs.forEach((orb) => {
                orb.fill = colorPalette.randomColor();
            });
        });

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

});