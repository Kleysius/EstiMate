import * as PIXI from "https://cdn.skypack.dev/pixi.js@5.x";
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur@3.2.0";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.0";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";

// renvoie un nombre aléatoire dans une plage
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// mappe un nombre d'une plage à une autre
function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Crée une nouvelle instance de bruit simplex
const simplex = new SimplexNoise();

// classe Palette de couleurs
class ColorPalette {
    constructor() {
        this.setColors();
        this.setCustomProperties();
    }

    setColors() {
        // choisissez une teinte aléatoire entre 220 et 360
        this.hue = ~~random(220, 360);
        this.complimentaryHue1 = this.hue + 30;
        this.complimentaryHue2 = this.hue + 60;
        // définir une saturation et une luminosité fixes
        this.saturation = 95;
        this.lightness = 50;

        // définir une couleur de base
        this.baseColor = hsl(this.hue, this.saturation, this.lightness);
        // définir une couleur complémentaire, à 30 degrés de la base
        this.complimentaryColor1 = hsl(
            this.complimentaryHue1,
            this.saturation,
            this.lightness
        );
        // définir une deuxième couleur complémentaire, à 60 degrés de la base
        this.complimentaryColor2 = hsl(
            this.complimentaryHue2,
            this.saturation,
            this.lightness
        );

        // stocker les choix de couleurs dans un tableau afin qu'un choix aléatoire puisse être effectué plus tard
        this.colorChoices = [
            this.baseColor,
            this.complimentaryColor1,
            this.complimentaryColor2
        ];
    }

    randomColor() {
        // choisissez une couleur aléatoire
        return this.colorChoices[~~random(0, this.colorChoices.length)].replace(
            "#",
            "0x"
        );
    }

    setCustomProperties() {
        // définissez des propriétés personnalisées CSS afin que les couleurs définies ici puissent être utilisées dans toute l'interface utilisateur
        document.documentElement.style.setProperty("--hue", this.hue);
        document.documentElement.style.setProperty(
            "--hue-complimentary1",
            this.complimentaryHue1
        );
        document.documentElement.style.setProperty(
            "--hue-complimentary2",
            this.complimentaryHue2
        );
    }
}

// Orb class
class Orb {
    // Pixi prend les couleurs hexadécimales comme littéraux hexadécimaux (0x plutôt qu'une chaîne avec '#')
    constructor(fill = 0x000000) {
        // bounds = la zone dans laquelle un orbe est "autorisé" à se déplacer
        this.bounds = this.setBounds();
        // initialise les valeurs { x, y } de l'orbe à un point aléatoire dans ses limites
        this.x = random(this.bounds["x"].min, this.bounds["x"].max);
        this.y = random(this.bounds["y"].min, this.bounds["y"].max);

        // la taille de l'orbe par rapport à son rayon d'origine (cela se modulera au fil du temps)
        this.scale = 1;

        // quelle couleur est l'orbe ?
        this.fill = fill;

        // le rayon d'origine de l'orbe, défini par rapport à la hauteur de la fenêtre
        this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

        // points de départ dans "le temps" pour le bruit/valeurs aléatoires similaires à soi-même
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        // à quelle vitesse le bruit/valeurs aléatoires similaires à soi-même passent à travers le temps
        this.inc = 0.002;

        // PIXI.Graphics est utilisé pour dessiner des primitives 2d (dans ce cas un cercle) sur le canevas
        this.graphics = new PIXI.Graphics();
        this.graphics.alpha = 0.825;

        // 250ms après le dernier événement de redimensionnement de la fenêtre, recalculez les positions des orbes.
        window.addEventListener(
            "resize",
            debounce(() => {
                this.bounds = this.setBounds();
            }, 250)
        );
    }

    setBounds() {
        // à quelle distance de l'origine { x, y } chaque orbe peut-il se déplacer
        const maxDist = window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
        // l'origine { x, y } de chaque orbe (le coin inférieur droit de l'écran)
        const originX = window.innerWidth / 1.25;
        const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 1.375;

        // permettre à chaque orbe de se déplacer à une distance x de son origine x / y
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

    update() {
        // valeurs "pseudo-aléatoires" similaires à soi-même ou bruit à un moment donné dans "le temps"
        const xNoise = simplex.noise2D(this.xOff, this.xOff);
        const yNoise = simplex.noise2D(this.yOff, this.yOff);
        const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

        // mappez les valeurs xNoise/yNoise (entre -1 et 1) à un point dans les limites de l'orbe
        this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
        this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
        // mappez scaleNoise (entre -1 et 1) à une valeur d'échelle quelque part entre la moitié de la taille d'origine de l'orbe et 100% de sa taille d'origine
        this.scale = map(scaleNoise, -1, 1, 0.5, 1);

        // passer à travers "le temps"
        this.xOff += this.inc;
        this.yOff += this.inc;
    }

    render() {
        // mettre à jour les valeurs de position et d'échelle de PIXI.Graphics
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);

        // effacer tout ce qui est actuellement dessiné sur les graphiques
        this.graphics.clear();

        // indiquez aux graphiques de remplir toutes les formes dessinées après cela avec la couleur de remplissage de l'orbe
        this.graphics.beginFill(this.fill);
        // dessiner un cercle à { 0, 0 } avec sa taille définie par ce rayon
        this.graphics.drawCircle(0, 0, this.radius);
        // laissez les graphiques savoir que nous ne remplirons plus de formes
        this.graphics.endFill();
    }
}

// Créer une application PixiJS
const app = new PIXI.Application({
    // rendu à <canvas class="orb-canvas"></canvas>
    view: document.querySelector(".orb-canvas"),
    // ajuster automatiquement la taille pour s'adapter à la fenêtre actuelle
    resizeTo: window,
    // arrière-plan transparent, nous créerons plus tard un arrière-plan de dégradé à l'aide de CSS
    transparent: true
});

app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

// Créer une palette de couleurs
const colorPalette = new ColorPalette();

// Créer des orbes
const orbs = [];

for (let i = 0; i < 10; i++) {
    const orb = new Orb(colorPalette.randomColor());

    app.stage.addChild(orb.graphics);

    orbs.push(orb);
}

// Animate!
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