// Récupération du bouton qui permet de changer de mode (clair/sombre)
const modeSwitch = document.querySelector('.mode-switch');

// Ajout d'un écouteur d'événements sur le bouton pour changer le mode d'affichage
modeSwitch.addEventListener('click', function () {
    // Toggle entre le mode clair et sombre lorsque le bouton est cliqué
    document.documentElement.classList.toggle('dark');
    // Toggle l'état actif du bouton
    modeSwitch.classList.toggle('active');
});

// Définition des onglets
const tabs = ['home', 'estimate', 'account', 'messagerie', 'contact'];
// Définition des styles d'affichage pour chaque onglet
const displayStyles = ['flex', 'flex', 'flex', 'flex', 'flex'];

// Fonction pour retirer la classe active des onglets
function removeActiveClass() {
    // Parcours de chaque onglet et suppression de la classe 'active'
    tabs.forEach(tab => document.getElementById(`${tab}-tab`).classList.remove('active'));
}

// Fonction pour masquer toutes les sections
function hideAllSections() {
    // Parcours de chaque onglet et masquage de la section correspondante
    tabs.forEach(tab => document.getElementById(`${tab}-section`).style.display = 'none');
}

// Fonction pour gérer le toggling
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarToggle.classList.toggle('active');
    sidebarToggleI.classList.toggle('active');
}

const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarToggleI = document.querySelector('.sidebar-toggle i');
const sidebar = document.querySelector('.sidebar');

// Ecouteur d'événement pour le bouton de la sidebar
sidebarToggle.addEventListener('click', toggleSidebar);

// Ajout d'un écouteur d'événements à chaque onglet
tabs.forEach((tab, index) => {
    document.getElementById(`${tab}-tab`).addEventListener('click', function () {
        // Masquage de toutes les sections
        hideAllSections();
        // Affichage de la section correspondante à l'onglet cliqué
        document.getElementById(`${tab}-section`).style.display = displayStyles[index];
        // Suppression de la classe 'active' de tous les onglets
        removeActiveClass();
        // Ajout de la classe 'active' à l'onglet cliqué
        this.classList.add('active');

        // Fermeture de la sidebar
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
});

// Gestion du clic sur le lien 'estimate'
document.getElementById('estimate-link').addEventListener('click', function (e) {
    // Empêche le comportement par défaut du clic sur un lien
    e.preventDefault();
    // Déclenche un clic sur l'onglet 'estimate'
    document.getElementById('estimate-tab').click();
});

// Gestion du clic sur le bouton 'account'
document.querySelectorAll('.account-button').forEach(button => {
    button.addEventListener('click', function () {
        // Masquage de toutes les sections
        hideAllSections();
        // Affichage de la section 'account'
        document.getElementById('account-section').style.display = 'flex';
        // Suppression de la classe 'active' de tous les onglets
        removeActiveClass();
        // Ajout de la classe 'active' à l'onglet 'account'
        document.getElementById('account-tab').classList.add('active');

        // Fermeture de la sidebar
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
});

// Récupération des éléments toggle
const toggles = document.getElementsByClassName("toggle");

// Parcours de chaque élément toggle
for (let i = 0; i < toggles.length; i++) {
    // Récupération du conteneur de table et de l'icône toggle
    const tableContainer = toggles[i].nextElementSibling;
    const toggleIcon = toggles[i].querySelector(".toggle-icon");

    // Initialisation du conteneur de table à une hauteur de 0px
    tableContainer.style.maxHeight = "0px";

    // Ajout d'un écouteur d'événements sur chaque élément toggle
    toggles[i].addEventListener("click", function () {
        // Si le conteneur de table est caché
        if (tableContainer.style.maxHeight === "0px") {
            // Récupération de la hauteur du conteneur de table
            const tableContainerHeight = tableContainer.scrollHeight + "px";
            // Modification de la hauteur du conteneur de table pour l'afficher
            tableContainer.style.maxHeight = tableContainerHeight;
            tableContainer.style.marginTop = "15px";
            // Changement de l'icône en '-'
            toggleIcon.classList.remove('fa-plus-circle');
            toggleIcon.classList.add('fa-minus-circle');
        } else {
            // Si le conteneur de table est visible, on le cache
            tableContainer.style.maxHeight = "0px";
            tableContainer.style.marginTop = "0px";
            // Changement de l'icône en '+'
            toggleIcon.classList.add('fa-plus-circle');
            toggleIcon.classList.remove('fa-minus-circle');
        }
    });
}

// Fonction pour supprimer une estimation
function deleteEstimation(event, id) {
    // Empêche le comportement par défaut du clic sur un lien
    event.preventDefault();

    // Récupération de la modal de suppression
    const deleteModal = document.getElementById('deleteModal');
    // Récupération des boutons 'cancel' et 'confirm'
    const btnCancel = deleteModal.querySelector('.cancel');
    const btnConfirm = deleteModal.querySelector('.confirm');

    // Affichage de la modal de suppression
    deleteModal.style.display = 'block';

    // Gestion du clic sur le bouton 'cancel'
    btnCancel.onclick = function () {
        // Masquage de la modal de suppression
        deleteModal.style.display = 'none';
    }

    // Gestion du clic sur le bouton 'confirm'
    btnConfirm.onclick = function () {
        // Masquage de la modal de suppression
        deleteModal.style.display = 'none';
        // Redirection vers l'URL de suppression de l'estimation
        window.location.href = "/delete_estimation/" + id;
    }
}

document.getElementById('logout').addEventListener('click', function (e) {
    e.preventDefault();
    const logoutModal = document.getElementById('logoutModal');
    logoutModal.style.display = 'block';

    const btnCancel = logoutModal.querySelector('.cancel');
    btnCancel.onclick = function () {
        logoutModal.style.display = 'none';
    }

    const btnConfirm = logoutModal.querySelector('.confirm');
    btnConfirm.onclick = function () {
        window.location.href = '/logout';
    }
});

// Fonction pour ajouter un "like" à un message
function addLike(message) {
    const bubble = message.querySelector('.bubble');

    let like = document.createElement('div');
    like.className = 'like';

    // Ajoute une autre classe si le message est un message de l'utilisateur
    if (message.className.includes('sent')) {
        like.classList.add('user-like');
    }

    // Ajout d'un écouteur d'événement sur la bulle du message pour le double clic
    bubble.addEventListener('dblclick', function () {
        if (like.parentElement === bubble) {
            // Si le message est déjà "liké", on retire le "like"
            bubble.removeChild(like);
        } else {
            // Sinon, on ajoute un "like" au message
            bubble.appendChild(like);
        }
    });
}

// Fonction pour faire défiler le chat vers le bas
function scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
}

// Messages automatiques à envoyer
let autoMessages = [
    "Merci pour votre message. Je suis en train d'y jeter un œil.",
    "En attendant, n'hésitez pas à consulter notre FAQ, elle contient beaucoup d'informations utiles.",
    "Ah, votre question me fait penser à une citation : \"Mieux vaut tard que jamais\". Je reviens vers vous dès que possible.",
    "Je suis en train de recueillir toutes les informations nécessaires pour vous donner la meilleure réponse possible. Un peu de patience s'il vous plaît.",
    "Comme dirait un célèbre philosophe : \"Je pense donc je suis\". Je suis actuellement en pleine réflexion sur votre question.",
    "Avez-vous déjà entendu parler du concept de patience ? C'est une vertu que je vous encourage à découvrir.",
    "Je suis désolé si je vous ai fait attendre. Comme dirait un autre grand philosophe : \"Le temps, c'est de l'argent\". Et j'apprécie combien vous investissez dans cette conversation.",
    "On dirait que nous sommes à la fin de notre liste de messages pré-programmés. N'hésitez pas à m'envoyer un autre message si vous avez encore des questions !"
];

let autoMessageIndex = 0;

function createMessage(content, avatarUrl, className) {

    const message = document.createElement('div');
    message.className = `message ${className}`;
    message.innerHTML = `
        <img src="${avatarUrl}" alt="User avatar" class="message-avatar">
        <div class="bubble">${content}</div>
    `;
    addLike(message);
    return message;

}

function sendMessage(content, avatarUrl, className, delay = 0) {
    setTimeout(() => {
        const message = createMessage(content, avatarUrl, className);
        document.getElementById('chat').appendChild(message);
        scrollToBottom();
    }, delay);
}

// Ajout de la fonction de "like" au premier message
const firstMessage = document.querySelector('.message.received');
addLike(firstMessage);

document.getElementById('send-message').addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('message-input');
    const userAvatarUrl = document.getElementById('userAvatarUrl').value;

    sendMessage(`<p>${input.value}</p>`, userAvatarUrl, 'sent');

    if (autoMessageIndex < autoMessages.length) {
        sendMessage(`<p>${autoMessages[autoMessageIndex]}</p>`, "img/freelance-user.jpg", 'received', 1000);
        autoMessageIndex++;
    }

    input.value = '';
});

document.getElementById('smiley').addEventListener('click', function () {
    const menu = document.getElementById('emoji-menu');
    menu.classList.toggle('show');
});

document.querySelectorAll('.emoji').forEach(function (emoji) {
    emoji.addEventListener('click', function () {
        const userAvatarUrl = document.getElementById('userAvatarUrl').value;
        sendMessage(this.outerHTML, userAvatarUrl, 'sent');

        if (autoMessageIndex < autoMessages.length) {
            sendMessage(`<p>${autoMessages[autoMessageIndex]}</p>`, "img/freelance-user.jpg", 'received', 1000);
            autoMessageIndex++;
        }

        document.getElementById('emoji-menu').classList.remove('show');
    });
});

document.addEventListener('click', function (event) {
    // Gestion de la sidebar
    let isClickInsideSidebar = sidebar.contains(event.target);
    let isClickInsideToggle = sidebarToggle.contains(event.target);
    if (!isClickInsideSidebar && !isClickInsideToggle && sidebar.classList.contains('active')) {
        toggleSidebar();
    }

    // Gestion du menu emoji
    const menu = document.getElementById('emoji-menu');
    if (menu.classList.contains('show') && !menu.contains(event.target) && event.target.id !== 'smiley') {
        menu.classList.remove('show');
    }
});

// Fonction asynchrone pour envoyer un email
async function sendEmail(element, estimateId) {
    try {
        element.innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse email-loader"></i>'; // Affiche un loader pendant l'envoi de l'email
        let response = await fetch(`/send_estimation/${estimateId}`); // Appel API pour envoyer l'email
        if (response.ok) {
            // Si l'email a été envoyé avec succès, affiche une icône de validation
            element.innerHTML = '<i class="fa-solid fa-envelope-circle-check email-check"></i>';
        } else {
            throw new Error(`Email not sent: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        // En cas d'erreur, affiche une icône d'erreur
        element.innerHTML = '<i class="fa-solid fa-envelope-circle-xmark email-error"></i>';
    }
}

const contactModal = document.getElementById('contactModal');
const btnContact = document.getElementById('btnContactUs');
const closeContactModal = document.querySelector('.closeContactModal');

btnContact.onclick = function () {
    contactModal.style.display = 'block';
}

closeContactModal.onclick = function () {
    contactModal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == contactModal) {
        contactModal.style.display = 'none';
    }
}

function openMessage(id) {
    // Obtenez toutes les divs de message complet
    var messageDivs = document.getElementsByClassName('message-full');

    // Cachez toutes les divs de message
    for (var i = 0; i < messageDivs.length; i++) {
        messageDivs[i].style.display = 'none';
    }

    // Obtenez la div de message spécifique que vous voulez afficher
    var messageDiv = document.getElementById('message' + id);

    // Affichez la div de message
    if (messageDiv.style.display === 'none') {
        messageDiv.style.display = 'flex';
    } else {
        messageDiv.style.display = 'none';
    }
}

document.getElementById('deleteMessages').addEventListener('click', async () => {
    // Récupération de tous les checkboxes
    const checkboxes = document.querySelectorAll('.message-checkbox');

    // Parcourir chaque checkbox pour trouver celles qui sont cochées
    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            // Extraire l'ID du message de l'ID de la checkbox
            const messageId = checkbox.id.replace('message-checkbox-', '');

            // Effectuer la requête DELETE
            try {
                const response = await fetch(`/contact/delete-message/${messageId}`, { method: 'DELETE' });

                // Si la requête a réussi, appliquer l'animation de fadeout et supprimer le message de la liste
                if (response.ok) {
                    const messageElementFull = document.getElementById(`message${messageId}`);
                    const messageElementPreview = document.querySelector(`.message-preview[onclick="openMessage('${messageId}')"]`);

                    messageElementFull.classList.add('fadeout');
                    if (messageElementPreview) {
                        messageElementPreview.classList.add('fadeout');
                    }

                    // Après que l'animation soit terminée, supprimer les éléments
                    setTimeout(() => {
                        messageElementFull.remove();
                        if (messageElementPreview) {
                            messageElementPreview.remove();
                        }
                    }, 500); // 500 est la durée de l'animation en millisecondes

                } else {
                    console.error('Erreur lors de la suppression du message');
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du message', error);
            }
        }
    }
});