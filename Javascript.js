function chardown() {
    var charDropdown = document.getElementsByClassName("sub-menu-1")[0];
    console.log(charDropdown.style.display)
    if(charDropdown.style.display === "") {
        charDropdown.style.display = "block";
    } else if (charDropdown.style.display === "none") {
        charDropdown.style.display = "block";
    } else {
        charDropdown.style.display = "none";
}}

function weapondown() {
    var weaponDropdown = document.getElementsByClassName("sub-menu-2")[0];
    console.log(weaponDropdown.style.display)
    if(weaponDropdown.style.display === "") {
        weaponDropdown.style.display = "block";
    } else if (weaponDropdown.style.display === "none") {
        weaponDropdown.style.display = "block";
    } else {
        weaponDropdown.style.display = "none";
}}

function artifdown() {
    var artifDropdown = document.getElementsByClassName("sub-menu-3")[0];
    console.log(artifDropdown.style.display)
    if(artifDropdown.style.display === "") {
        artifDropdown.style.display = "block";
    } else if (artifDropdown.style.display === "none") {
        artifDropdown.style.display = "block";
    } else {
        artifDropdown.style.display = "none";
}}