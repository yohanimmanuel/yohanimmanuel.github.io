function dropdown() {
    var openDropdown = document.getElementsByClassName("sub-menu-1")[0];
    console.log(openDropdown.style.display)
    if(openDropdown.style.display === "") {
        openDropdown.style.display = "block";
    } else if (openDropdown.style.display === "none") {
        openDropdown.style.display = "block";
    } else {
        openDropdown.style.display = "none";
    }
    // console.log(openDropdown.classList.contains('show'))

    // if (openDropdown.classList.contains('show')) {
    //     openDropdown.classList.remove('show');
    // } else {
    //     openDropdown.classList.add('show')
    // }
}