var concertButn = document.getElementById("get-concert");
var venueButn = document.getElementById("venue");
var afternoonButn = document.getElementById("get-afternoon");
var nightButn = document.getElementById("get-night");
var searchButn = document.getElementById("get-search");
var dateButn = document.getElementById("get-date");
var eventNameButn = document.getElementById("eventname");
var pageOverButn = document.getElementById("pageover");
var scrollNumberButn = document.getElementById("boldpagenum");

concertButn.addEventListener("click", concert);

venueButn.addEventListener("click", Festival);

afternoonButn.addEventListener("click", Afternoon);

nightButn.addEventListener("click", Night);

searchButn.addEventListener("click", Search);

dateButn.addEventListener("click", Date);

eventNameButn.addEventListener("click", Event);

pageOverButn.addEventListener("click", Page-Over);

scrollNumberButn.addEventListener("click", Number);



