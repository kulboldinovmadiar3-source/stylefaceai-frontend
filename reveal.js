const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

reveals.forEach(el => observer.observe(el));

window.addEventListener("scroll", ()=>{

document.querySelectorAll(".parallax").forEach(el=>{
    
    let speed = 0.3;
    el.style.transform = `translateY(${window.scrollY * speed}px)`;
    
});

});
