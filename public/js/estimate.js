// Sélectionne toutes les sections de la page
const sections = document.querySelectorAll('section');
// Sélectionne la barre de progression
const progressBar = document.querySelector('.progressBar');
// Sélectionne la partie active de la barre de progression
const progressBarActive = document.querySelector('.progressBar-green');

// Fonction pour animer une section lorsqu'elle est fermée et la suivante lorsqu'elle est ouverte
function animateSection(section, nextSection = null) {
    // Animer la section courante pour qu'elle disparaisse vers le haut
    gsap.to(section, {
        duration: 0.5,
        y: '-100%',
        ease: 'power3.inOut',
        onComplete: () => { // Lorsque l'animation est terminée
            section.style.display = 'none'; // Masquer la section courante
            if (nextSection) { // Si une section suivante est fournie
                nextSection.style.display = 'flex'; // Afficher la section suivante
                // Animer la section suivante pour qu'elle apparaisse depuis le bas
                gsap.from(nextSection, {
                    duration: 0.5,
                    y: '100%',
                    ease: 'power3.inOut',
                });
            }
        }
    });

}

// Fonction pour montrer ou cacher plusieurs sections en même temps
function toggleSections(show, ...sections) {
    sections.forEach(section => {
        section.style.display = show ? 'flex' : 'none';
    });
}

// Pour chaque section
sections.forEach((section, index) => {
    // Sélectionne le bouton suivant dans la section
    const button = section.querySelector('.next-button');
    if (button) { // Si le bouton existe
        // Ajoute un gestionnaire d'événements pour le clic sur le bouton
        button.addEventListener('click', () => {
            // Animer la section courante et la suivante
            animateSection(section, sections[index + 1]);
            // Mettre à jour la barre de progression en fonction de l'avancement actuel
            updateProgressBar((index + 1) / (sections.length - 1));
            // Si nous sommes à l'avant-dernière section, retirer l'arrondi du coin droit de la barre de progression active
            if (index === sections.length - 2) {
                progressBarActive.style.borderRadius = '0';
            }
        });
    }
});

// Mettre à jour la barre de progression en fonction du pourcentage d'avancement
function updateProgressBar(percentage) {
    progressBarActive.style.width = `${percentage * 100}%`;
}

// Sélectionne toutes les cartes de la page
let cards = document.querySelectorAll('.card');
// Pour chaque carte
cards.forEach(card => {
    // Ajoute un gestionnaire d'événements pour le clic sur la carte
    card.addEventListener('click', () => {
        // Pour chaque carte, retire la classe 'selected'
        cards.forEach(card => card.classList.remove('selected'));
        // Active le bouton radio dans la carte cliquée
        card.querySelector('input[type=radio]').click();
        // Ajoute la classe 'selected' à la carte cliquée
        card.classList.add('selected');
    });
});

// Fonction pour ajouter la classe 'selected' lorsqu'un élément est modifié
function addSelectedClass(id) {
    document.getElementById(id).addEventListener("change", function () {
        this.classList.add("selected");
    });
}

// Appelle la fonction addSelectedClass pour les éléments avec les ids 'support_pack' et 'page_number'
['support_pack', 'page_number'].forEach(addSelectedClass);