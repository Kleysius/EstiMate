const sections = document.querySelectorAll('section');
const progressBar = document.querySelector('.progressBar');
const progressBarActive = document.querySelector('.progressBar-green');

function animateSection(section, nextSection = null) {
    gsap.to(section, {
        duration: 0.5,
        y: '-100%',
        ease: 'power3.inOut',
        onComplete: () => {
            section.style.display = 'none';
            if (nextSection) {
                nextSection.style.display = 'flex';
                gsap.from(nextSection, {
                    duration: 0.5,
                    y: '100%',
                    ease: 'power3.inOut',
                });
            }
        }
    });

}

function toggleSections(show, ...sections) {
    sections.forEach(section => {
        section.style.display = show ? 'flex' : 'none';
    });
}

sections.forEach((section, index) => {
    const button = section.querySelector('.next-button');
    if (button) {
        button.addEventListener('click', () => {
            animateSection(section, sections[index + 1]);
            updateProgressBar((index + 1) / (sections.length - 1));
            if (index === sections.length - 2) {
                progressBarActive.style.borderRadius = '0';
            }
        });
    }
});

function updateProgressBar(percentage) {
    progressBarActive.style.width = `${percentage * 100}%`;
}

let cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('click', () => {
        cards.forEach(card => card.classList.remove('selected'));
        card.querySelector('input[type=radio]').click();
        card.classList.add('selected');
    });
});

function addSelectedClass(id) {
    document.getElementById(id).addEventListener("change", function () {
        this.classList.add("selected");
    });
}

['support_pack', 'page_number'].forEach(addSelectedClass);