let faqQuestions = document.querySelectorAll('.faq-question');

// Bouclez sur chaque question
faqQuestions.forEach((faqQuestion) => {
    faqQuestion.addEventListener('click', function () {
        // Récupérez la réponse et l'icône associées à cette question
        let faqAnswer = this.nextElementSibling;
        let faqChevron = this.querySelector('.faq-chevron');

        // Si la réponse est déjà ouverte, fermez-la, sinon ouvrez-la
        if (faqAnswer.style.maxHeight) {
            faqAnswer.style.maxHeight = null;
            faqAnswer.style.marginBottom = "0";
            faqChevron.style.transform = "rotate(0deg)";
        } else if (faqAnswer.style.maxHeight == 0) {
            faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
            faqAnswer.style.marginBottom = "10px";
            faqChevron.style.transform = "rotate(-90deg)";
        }
    });
});

window.addEventListener('load', function () {

    ScrollReveal().reveal('.content-section.one', {
        delay: 200,
        duration: 1500,
        origin: 'left',
        distance: '100px',
        reset: true
    });

    ScrollReveal().reveal('.content-section.two', {
        delay: 600,
        duration: 1500,
        origin: 'right',
        distance: '100px',
        reset: true
    });

    ScrollReveal().reveal('.faq-content', {
        delay: 200,
        duration: 1500,
        origin: 'bottom',
        distance: '100px',
        reset: true
    });

});