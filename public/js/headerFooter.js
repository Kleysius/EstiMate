const overlayHeader = document.getElementById('overlay-header');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');
const bars = document.querySelector('.fa-bars');
const times = document.querySelector('.fa-times');

burger.addEventListener('click', () => {
    // Toggle Nav and Overlay
    navLinks.classList.toggle('toggle');
    overlayHeader.style.display = (overlayHeader.style.display !== 'block') ? 'block' : 'none';

    // Animate Links
    links.forEach((link, index) => {
        link.style.animation = link.style.animation ? '' : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
    });

    // Burger Animation
    burger.classList.toggle('toggle');

    // Switch icon
    times.style.display = (times.style.display !== 'none') ? 'none' : 'block';
    bars.style.display = (bars.style.display !== 'none') ? 'none' : 'block';
});