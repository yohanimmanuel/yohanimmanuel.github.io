function dropdown() {
    document.getElementById("droplist").classList.toggle("show");
}

windoww.onclick = function(event) {
    if(!event.target.matches(',dropbtn')) {
        var dropdowns = document.getElementsByClassName("sub-menu-1");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}