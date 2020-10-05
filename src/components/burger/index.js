let menu = document.getElementById("contain");

menu.addEventListener("click", function(){
    let nav = document.getElementById("nav");
    nav.classList.toggle("open");
    
    menu.classList.toggle("change");
});

