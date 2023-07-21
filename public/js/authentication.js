const modal = document.getElementById("avatarModal");
const btn = document.getElementById("openAvatarModal");
const span = document.getElementById("closeAvatarModal");

// Quand l'utilisateur clique sur le bouton, ouvre la modale
btn.onclick = function (e) {
    e.preventDefault();
    modal.style.display = "block";
}

// Quand l'utilisateur clique sur le span (x), ferme la modale
span.onclick = function () {
    modal.style.display = "none";
}

// Quand l'utilisateur clique en dehors de la modale, ferme la modale
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const avatarOptions = document.getElementsByName('avatarOption');
const selectedAvatar = document.getElementById('selectedAvatar');
const avatarPreviews = document.querySelectorAll('.avatar-preview');

// Quand l'utilisateur clique sur le bouton, sauvegarde la sélection
const saveButton = document.getElementById('saveAvatarSelection');
saveButton.onclick = function () {
    for (let i = 0; i < avatarOptions.length; i++) {
        if (avatarOptions[i].checked) {
            selectedAvatar.value = avatarOptions[i].value;
            // Mettre à jour toutes les prévisualisations d'avatar
            for (let j = 0; j < avatarPreviews.length; j++) {
                avatarPreviews[j].src = avatarOptions[i].value;
            }
            break;
        }
    }
    modal.style.display = "none";
}

ScrollReveal().reveal('.register-explanation', {
    delay: 200,
    duration: 1500,
    origin: 'left',
    distance: '100px',
    reset: true
});

const containers = document.querySelectorAll('.container');
containers.forEach((container) => {
    ScrollReveal().reveal(container, {
        delay: 200,
        duration: 1500,
        origin: 'bottom',
        distance: '100px',
        reset: true
    });
}
);