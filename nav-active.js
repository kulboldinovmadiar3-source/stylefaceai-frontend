const links = document.querySelectorAll(".nav-link");

const currentPage = window.location.pathname.split("/").pop();

if(currentPage === ""){
    currentPage = "index.html";
}

links.forEach(link => {

    if(link.getAttribute("href") === currentPage){
        link.classList.add("active");
    }

});



