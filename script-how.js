// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){
    reveals.forEach(el => {

        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;

        if(elementTop < windowHeight - 100){
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);

const links = document.querySelectorAll(".nav-link");

links.forEach(link => {
    if(link.href === window.location.href){
        link.classList.add("active");
    }
});