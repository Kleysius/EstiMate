const form = document.getElementById('contact-form');
const submitButton = document.querySelector('.submit-btn');

async function sendEmailContact() {
    try {
        // Affiche un loader pendant l'envoi de l'email
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        fetch('/contactUs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                message: form.message.value,
                subject: "Contact visiteur"
            })
        }).then(response => {
            console.log(response);
            if (response.ok) {
                submitButton.innerHTML = 'Envoyé <i class="fa-solid fa-check"></i>';
            } else {
                throw new Error('Erreur lors de l\'envoi du formulaire');
            }
        })

    } catch (error) {
        console.log(error);
        submitButton.innerHTML = 'Erreur <i class="fa-solid fa-exclamation"></i>';
    }
}