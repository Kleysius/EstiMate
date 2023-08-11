// Sélectionne toutes les sections de la page
const sections = document.querySelectorAll("section");
// Sélectionne la barre de progression
const progressBar = document.querySelector(".progressBar");
// Sélectionne la partie active de la barre de progression
const progressBarActive = document.querySelector(".progressBar-green");

// Fonction pour animer une section lorsqu'elle est fermée et la suivante lorsqu'elle est ouverte
function animateSection(section, nextSection = null) {
  // Animer la section courante pour qu'elle disparaisse vers le haut
  gsap.to(section, {
    duration: 0.5,
    y: "-100%",
    ease: "power3.inOut",
    onComplete: () => {
      // Lorsque l'animation est terminée
      section.style.display = "none"; // Masquer la section courante
      if (nextSection) {
        // Si une section suivante est fournie
        nextSection.style.display = "flex"; // Afficher la section suivante
        // Animer la section suivante pour qu'elle apparaisse depuis le bas
        gsap.from(nextSection, {
          duration: 0.5,
          y: "100%",
          ease: "power3.inOut",
        });
      }
    },
  });
}

// Fonction pour montrer ou cacher plusieurs sections en même temps
function toggleSections(show, ...sections) {
  sections.forEach((section) => {
    section.style.display = show ? "flex" : "none";
  });
}

// Vérifie si le champ de texte n'est pas vide après avoir retiré les espaces en début et en fin de chaîne
function isTextFieldFilled(textField) {
  return textField.value.trim() !== "";
}

// Vérifier si au moins un bouton radio a été sélectionné
function isAnyRadioChecked(radioInputs) {
  for (const radioInput of radioInputs) {
    if (radioInput.checked) {
      return true;
    }
  }
  return false;
}

// Vérifier si au moins une case à cocher a été cochée
function isAnyCheckboxChecked(checkboxes) {
  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      return true; // Au moins une case a été cochée
    }
  }
  return false; // Aucune case n'a été cochée
}

// Vérifier si toutes les réponses ont été données dans une section
function areAllInputsAnswered(section) {
  const inputs = section.querySelectorAll(
    'input[type="radio"], input[type="checkbox"], select, input[type="text"]'
  );
  for (const input of inputs) {
    if (input.type === "select") {
      if (input.value === "") {
        return false; // Une réponse n'a pas été donnée dans le champ "select"
      }
    } else if (input.type === "checkbox") {
      const checkboxes = section.querySelectorAll('input[type="checkbox"]');
      if (!isAnyCheckboxChecked(checkboxes)) {
        return false; // Aucune case n'a été cochée dans les cases à cocher
      }
    } else if (input.type === "text") {
      if (!isTextFieldFilled(input)) {
        return false; // Le champ de texte n'est pas renseigné
      }
    } else if (input.type === "radio") {
      const radioInputs = section.querySelectorAll('input[type="radio"]');
      if (!isAnyRadioChecked(radioInputs)) {
        return false; // Aucun bouton radio n'a été sélectionné
      }
    }
  }
  return true; // Toutes les réponses ont été données
}

// Pour chaque section
sections.forEach((section, index) => {
  // Sélectionne le bouton suivant dans la section
  const button = section.querySelector(".next-button");

  // Empêche le formulaire de se soumettre lorsqu'on appuie sur "Entrée"
  section.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      button.click();
    }
  });

  // Si le bouton existe
  if (button) {
    // Ajoute un gestionnaire d'événements pour le clic sur le bouton
    button.addEventListener("click", () => {
      if (areAllInputsAnswered(section)) {
        animateSection(section, sections[index + 1]);
        updateProgressBar((index + 1) / (sections.length - 1));
        if (index === sections.length - 2) {
          progressBarActive.style.borderRadius = "0";
        }
      } else {
        const modalContent = document.querySelector(".modal-content");
        // Ajouter la classe "shake" à la partie du contenu de la modale
        modalContent.classList.add("shake");

        // Gestionnaire d'événements pour enlever la classe "shake" après l'animation
        modalContent.addEventListener("animationend", () => {
          modalContent.classList.remove("shake");
        });

        // Afficher la modale
        const modal = document.getElementById("myModal");
        modal.style.display = "flex";

        // Gestionnaire d'événements pour fermer la modale
        const closeModalButton = document.getElementById("closeModal");
        closeModalButton.addEventListener("click", () => {
          modal.style.display = "none";
        });
      }
    });
  }
});

// Mettre à jour la barre de progression en fonction du pourcentage d'avancement
function updateProgressBar(percentage) {
  progressBarActive.style.width = `${percentage * 100}%`;
}

// Sélectionne toutes les cartes de la page
let cards = document.querySelectorAll(".card");
// Pour chaque carte
cards.forEach((card) => {
  // Ajoute un gestionnaire d'événements pour le clic sur la carte
  card.addEventListener("click", () => {
    // Pour chaque carte, retire la classe 'selected'
    cards.forEach((card) => card.classList.remove("selected"));
    // Active le bouton radio dans la carte cliquée
    card.querySelector("input[type=radio]").click();
    // Ajoute la classe 'selected' à la carte cliquée
    card.classList.add("selected");
  });
});

// Fonction pour ajouter la classe 'selected' lorsqu'un élément est modifié
function addSelectedClass(id) {
  document.getElementById(id).addEventListener("change", function () {
    this.classList.add("selected");
  });
}

// Appelle la fonction addSelectedClass pour les éléments avec les ids 'support_pack' et 'page_number'
["support_pack", "page_number"].forEach(addSelectedClass);

document.querySelectorAll(".pack-card .card-header").forEach((header) => {
  header.addEventListener("click", (event) => {
    const content = header.nextElementSibling;
    content.style.maxHeight = content.style.maxHeight
      ? null
      : content.scrollHeight + "px";
  });
});

function makeCardsCollapsible() {
  if (window.innerWidth < 768) {
    document.querySelectorAll(".pack-card .card-header").forEach((header) => {
      header.addEventListener("click", (event) => {
        const content = header.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight
          ? null
          : content.scrollHeight + "px";
      });
    });
  }
}

makeCardsCollapsible();

window.addEventListener("resize", makeCardsCollapsible);

function afficherResultatLoader() {
  const loaderContainer = document.querySelector(".loader-container");
  const resultLoader = document.querySelector(".result-loader");
  const estimationText = document.querySelector(".loader-text");

  loaderContainer.style.display = "flex";

  setTimeout(function () {
    estimationText.innerHTML =
      'Estimation calculée ! <i class="fas fa-check"></i>';
    resultLoader.style.display = "none";
  }, 3000);

  setTimeout(function () {
    window.location.href = "/result";
  }, 4000);
}
