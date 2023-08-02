const cards = document.querySelectorAll(".freelancer-card");

cards.forEach((card) => {
    const border = card.querySelector(".border");
    const content = card.querySelector(".content");
    const dailyRate = card.querySelector(".daily-rate");

    card.addEventListener("click", () => {
        card.classList.toggle("active");
        border.classList.toggle("active");

        if (card.classList.contains("active")) {
            setTimeout(() => {
                content.classList.toggle("show");
                dailyRate.classList.toggle("show");
            }, 300);
        } else {
            content.classList.toggle("show");
            dailyRate.classList.toggle("show");
        }
    });
});
