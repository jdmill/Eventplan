//Open Weather API Key
var weatherAPI = "c05979fd50e5119c43cbd3ab81fe852f";
//TicketMaster API Explorer v2.0
var musicAPI = "BZZo8qKtqkk1hGSW6C14VUHCfMKAfSgz";
//google geocoding API
var geocodingAPI = "AIzaSyBp0qdtLkgEAa-WU1_78Yt3TOiB3gR-Rn0";
//inits var
var city = "";
var selectedDate = "";
var zip = "";

//queries elements
var eventsSection = document.querySelector(".events");
var eventTitle = document.querySelector("#event")


//readies the date picker function and sets default date to today
$(document).ready(function () {
  $("#datepicker").datepicker();
  $("#datepicker").datepicker("setDate", "today");
});

//search bar button that takes input and passes it to fetch city data.
$(".search-bar").submit(function (event) {
  event.preventDefault();

  //gets value from search parameters
  var city = $("#city-search-input").val();
  var selectedDate = $("#datepicker").val();
  console.log(selectedDate);
  console.log(city);

  //sets search parameter displays
  $("#header-city").html(city);
  fetchWeatherData(city);
  fetchMusicData(city);
});

//fetch data from OpenWeather API based on search bar input
function fetchWeatherData(city) {
  var queryWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    weatherAPI;
  fetch(queryWeatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //fetchGeocodeData(data.coord.lat, data.coord.lon);
      getForecast(data.coord.lat, data.coord.lon);
      console.log(data);
    });
}
/*//fetches geocode data
function fetchGeocodeData(lat, lon) {
  var queryGeocodeURL =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    lat +
    "," +
    lon +
    "&key=" +
    geocodingAPI;
  
  //fetches zip code
  fetch(queryGeocodeURL).then(function (response) {
    return response.json();
  }).then(function (data) {
    //loops through the first response from the location data
    var addressComponents = data.results[0].address_components;
    for (var i = 0; i < addressComponents.length; i++) {
      //if postal code type is present set zip to the value of short_name
      if (addressComponents[i].types.includes('postal_code')) {
        var zip = data.results[0].address_components[i].short_name;
        console.log(zip);
        fetchMusicData(zip);
        //return zip;
      }
    }
    console.log(data);
  });
}*/

//generates music query URL
function fetchMusicData(city) {
  var queryMusicURL =
    "https://app.ticketmaster.com/discovery/v2/events?apikey=" +
    musicAPI +
    //place holder - will replace with var once form functionality is created
    //need to add date functionality
    "&classificationName=Music" +
    "&city=" +
    city +
    "&locale=*";
  //will take parameter inputs to create query URL.
  //if loop here.
  console.log(queryMusicURL);
  //fetches TicketMaster API data based on inputed parameters
  fetch(queryMusicURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          createEventCard(data);
        });
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

//function that creates event cards
function createEventCard(data) {
  var eventsList = data._embedded.events;
  //console.log(eventsList);
  for (var i = 0; i < eventsList.length; i++){
    var createCard = document.createElement("div");
    var createTitle = document.createElement("p");
    var createImg = document.createElement("img");
    var createTime = document.createElement("p");
    var createVenue = document.createElement("p");
    var createSiteLink = document.createElement("a");

    //sets attribute to card - iteration of the loop
    createCard.setAttribute("id", "card-" + i);
    createCard.setAttribute("class", "cards");
    //appends the card into the events div
    eventsSection.appendChild(createCard);

    //sets title attribute and text content
    createTitle.setAttribute("id", "event-" + i);
    createTitle.textContent = data._embedded.events[i]._embedded.attractions[0].name;
    createTitle.setAttribute("class", "eventname");
    console.log(createTitle);
    //appends the title element to the child
    createCard.appendChild(createTitle);

    //creates img element and sets it - appends to card
    createImg.setAttribute("id", "img-" + i);
    createImg.src =
      data._embedded.events[i].images[0].url;
    console.log(createImg);
    createImg.setAttribute("class", "eventpic");
    createCard.appendChild(createImg);

    //sets venue attribute and text content
    createVenue.setAttribute("id", "venue-" + i);
    createVenue.textContent = data._embedded.events[i]._embedded.venues[0].name;
    createVenue.setAttribute("class", "venue");
    console.log(createVenue);
    //appends the venue element to the child
    createCard.appendChild(createVenue);

    createTime.setAttribute("id", "time-1" + i);
    createTime.textContent = data._embedded.events[i].dates.start.localTime;
    createTime.setAttribute("class", "time");
    console.log(createTime);
    //changing event time from 24 hour to 12-hour and adding am/pm
    var timechange = createTime.innerText;
    console.log(timechange);
    timechange = moment(timechange, "HH:mm:ss").format("hh:mm a");
    console.log(timechange);
    createTime.innerText = timechange;
    //appends the time element to the child
    createCard.appendChild(createTime);

    //sets site button attribute and creates link
    createSiteLink.setAttribute("id", "link-" + i);
    var linkurl = data._embedded.events[i].url;
    console.log(linkurl);
    createSiteLink.textContent = "site";
    createSiteLink.setAttribute("href", linkurl);
    createSiteLink.setAttribute("class", "sitebutton");
    createSiteLink.setAttribute("style", "text-decoration: none");
    createSiteLink.setAttribute("target", "_blank");
    console.log(createSiteLink);
    //appends the button element to the child
    createCard.appendChild(createSiteLink);
  }
};
//function the retrieves forecast data from openweather API based on lat & lon
function getForecast(lat, lon) {
  var getForecastUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=c05979fd50e5119c43cbd3ab81fe852f&units=imperial";

  //uses the open weather api to fetch weather data
  fetch(getForecastUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          //displayWeather function call here
          //displayWeather(data);
        });
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

//function that will parse weather data and display somewhere on the page
