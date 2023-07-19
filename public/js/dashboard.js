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

let autoMessages = [
    "Merci pour votre message. Je l'ai reçu et je vous répondrai sous peu.",
    "En attendant, vous pouvez consulter la FAQ ou les avis de mes clients.",
    "Trop cool ta vie !",
    "Ouai bon, ça va, on se calme !",
    "Je suis en train de travailler là ! Me gonfle pas tocard !",
    "Tu connais la blague du mec qui a oublié de répondre à un message ?",
    "Moi non plus, connard !",
    "Allez, ciao !"
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

    // Crée et ajoute une réponse automatique du freelance
    if (autoMessageIndex < autoMessages.length) {
        setTimeout(() => {
            const freelancerMessage = document.createElement('div');
            freelancerMessage.className = 'message received';
            freelancerMessage.innerHTML = `<img src="img/freelance-user.jpg" alt="Freelancer avatar" class="message-avatar">
            <div class="bubble"><p>${autoMessages[autoMessageIndex]}</p></div>`;
            document.getElementById('chat').appendChild(freelancerMessage);
            autoMessageIndex++;
        }, 1000);
    }

    // Efface le champ de saisie
    input.value = '';
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