const modeSwitch = document.querySelector('.mode-switch');
modeSwitch.addEventListener('click', function () {
    document.documentElement.classList.toggle('dark');
    modeSwitch.classList.toggle('active');
});

const tabs = ['home', 'estimate', 'account', 'messagerie', 'contact'];
const displayStyles = ['flex', 'flex', 'flex', 'flex', 'flex'];

function removeActiveClass() {
    tabs.forEach(tab => document.getElementById(`${tab}-tab`).classList.remove('active'));
}

function hideAllSections() {
    tabs.forEach(tab => document.getElementById(`${tab}-section`).style.display = 'none');
}

tabs.forEach((tab, index) => {
    document.getElementById(`${tab}-tab`).addEventListener('click', function () {
        hideAllSections();
        document.getElementById(`${tab}-section`).style.display = displayStyles[index];
        removeActiveClass();
        this.classList.add('active');
    });
});

document.getElementById('estimate-link').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('estimate-tab').click();
});

document.querySelectorAll('#account-button').forEach(button => {
    button.addEventListener('click', function () {
        hideAllSections();
        document.getElementById('account-section').style.display = 'flex';
        removeActiveClass();
        document.getElementById('account-tab').classList.add('active');
    });
});

const toggles = document.getElementsByClassName("toggle-icon");

for (let i = 0; i < toggles.length; i++) {
    const table = toggles[i].parentNode.nextElementSibling;

    // C'est pour éviter de cliquer deux fois sur le bouton pour afficher le tableau
    if (table.style.display === "flex") {
        table.style.display = "flex";
    } else {
        table.style.display = "none";
    }

    // Quand l'utilisateur clique sur le bouton, affiche ou cache le tableau et change l'icône
    toggles[i].addEventListener("click", function () {
        if (table.style.display === "none") {
            table.style.display = "flex";
            this.classList.remove('fa-plus-circle');
            this.classList.add('fa-minus-circle');
        } else {
            table.style.display = "none";
            this.classList.add('fa-plus-circle');
            this.classList.remove('fa-minus-circle');
        }
    });
}

function deleteEstimation(event, id) {
    event.preventDefault();
    const deleteModal = document.getElementById('deleteModal');
    const btnCancel = document.getElementById('cancel');
    const btnConfirm = document.getElementById('confirm');

    deleteModal.style.display = 'block';

    btnCancel.onclick = function () {
        deleteModal.style.display = 'none';
    }

    btnConfirm.onclick = function () {
        deleteModal.style.display = 'none';
        window.location.href = "/delete_estimation/" + id;
    }
}

function addLike(message) {
    const bubble = message.querySelector('.bubble');
    let isLiked = false;
    let like;
    bubble.addEventListener('dblclick', function () {
        if (isLiked) {
            // Si le message est déjà liké, efface le like
            bubble.removeChild(like);
        } else {
            // Sinon, ajoute un like au message
            like = document.createElement('div');
            like.className = 'like';
            // Ajoute une autre classe si le message est un message de l'utilisateur
            if (message.className.includes('sent')) {
                like.classList.add('user-like');
            }
            bubble.appendChild(like);
        }
        isLiked = !isLiked;  // Inverse l'état du like
    });
}

function scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Ajoute la fonction de like au premier message
    const firstMessage = document.querySelector('.message.received');
    addLike(firstMessage);
});

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

document.getElementById('send-message').addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('message-input');

    // Récupérez l'URL de l'avatar de l'utilisateur depuis l'élément caché
    const userAvatarUrl = document.getElementById('userAvatarUrl').value;

    // Crée et ajoute le message de l'utilisateur
    const userMessage = document.createElement('div');
    userMessage.className = 'message sent';
    userMessage.innerHTML = `<img src="${userAvatarUrl}" alt="User avatar" class="message-avatar">
    <div class="bubble"><p>${input.value}</p></div>`;
    document.getElementById('chat').appendChild(userMessage);
    addLike(userMessage);

    // Crée et ajoute une réponse automatique du freelance
    if (autoMessageIndex < autoMessages.length) {
        setTimeout(() => {
            const freelancerMessage = document.createElement('div');
            freelancerMessage.className = 'message received';
            freelancerMessage.innerHTML = `<img src="img/freelance-user.jpg" alt="Freelancer avatar" class="message-avatar">
            <div class="bubble"><p>${autoMessages[autoMessageIndex]}</p></div>`;
            document.getElementById('chat').appendChild(freelancerMessage);
            addLike(freelancerMessage);
            autoMessageIndex++;

            // Fait défiler la fenêtre de chat vers le bas après que le freelance ait répondu
            scrollToBottom();
        }, 1000);
    }

    // Efface le champ de saisie
    input.value = '';

    // Fait défiler la fenêtre de chat vers le bas après que l'utilisateur ait envoyé un message
    scrollToBottom();
});

// Quand l'utilisateur clique sur le smiley, ajoute le smiley au chat
document.getElementById('smiley').addEventListener('click', function () {
    const menu = document.getElementById('emoji-menu');
    if (menu.style.display === 'none') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
});

document.querySelectorAll('.emoji').forEach(function (emoji) {
    emoji.addEventListener('click', function () {
        const input = document.getElementById('message-input');
        const userAvatarUrl = document.getElementById('userAvatarUrl').value;
        input.value = this.outerHTML;  // Met l'emoji en tant que message

        // Crée et ajoute le message de l'utilisateur
        const userMessage = document.createElement('div');
        userMessage.className = 'message sent';
        userMessage.innerHTML = `<img src="${userAvatarUrl}" alt="User avatar" class="message-avatar">
        <div class="bubble">${input.value}</div>`;
        document.getElementById('chat').appendChild(userMessage);
        addLike(userMessage);

        // Crée et ajoute une réponse automatique du freelance
        if (autoMessageIndex < autoMessages.length) {
            setTimeout(() => {
                const freelancerMessage = document.createElement('div');
                freelancerMessage.className = 'message received';
                freelancerMessage.innerHTML = `<img src="img/freelance-user.jpg" alt="Freelancer avatar" class="message-avatar">
                <div class="bubble"><p>${autoMessages[autoMessageIndex]}</p></div>`;
                document.getElementById('chat').appendChild(freelancerMessage);
                addLike(freelancerMessage);
                autoMessageIndex++;

                // Fait défiler la fenêtre de chat vers le bas après que le freelance ait répondu à un smiley
                scrollToBottom();
            }, 1000);
        }

        // Efface le champ de saisie
        input.value = '';

        // Fait défiler la fenêtre de chat vers le bas après que l'utilisateur ait envoyé un smiley
        scrollToBottom();

        document.getElementById('emoji-menu').style.display = 'none';
    });
});

document.addEventListener('click', function (event) {
    const menu = document.getElementById('emoji-menu');
    if (menu.style.display === 'flex' && !menu.contains(event.target) && event.target.id !== 'smiley') {
        menu.style.display = 'none';
    }
});

async function sendEmail(element, estimateId) {
    element.innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse email-loader"></i>';
    let response = await fetch('/send_estimation/' + estimateId)
    if (response.status === 200) {
        element.innerHTML = '<i class="fa-solid fa-envelope-circle-check email-check"></i>';
    } else {
        element.innerHTML = '<i class="fa-solid fa-envelope-circle-xmark email-error"></i>';
    }
}