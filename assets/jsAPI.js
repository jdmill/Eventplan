//Open Weather API Key
var weatherAPI = "c05979fd50e5119c43cbd3ab81fe852f";
//TicketMaster API Explorer v2.0
var musicAPI = "BZZo8qKtqkk1hGSW6C14VUHCfMKAfSgz";
//google geocoding API
//var geocodingAPI = "AIzaSyBp0qdtLkgEAa-WU1_78Yt3TOiB3gR-Rn0";
//inits var
var city = "";
var zip = "";
var cityList = [];

//init values
var startTime = "01:00:00";
var endTime = "23:00:00";

//creates initial date value to date picker
var date = new Date();
var selectedDate = date.toISOString().substring(0, 10);
var now = moment().format("YYYY-MM-DD");

//queries elements
var eventsSection = document.querySelector(".events");
var eventTitle = document.querySelector("#event");
var datePicker = document.getElementById("datepicker");
var cityListEl = document.querySelector("#city-list");
var forecastLimit = moment().date() + 5;
var selectedDateDay = moment(selectedDate).date();
var dayValue = forecastLimit - selectedDateDay;

//readies the date picker function and sets default date to today
datePicker.value = selectedDate;
//search bar button that takes input and passes it to fetch city data.
$(".search-bar").submit(function (event) {
  event.preventDefault();

  //gets value from search parameters
  //gets time value from radio button "DAY OR NIGHT"
  var radioTime = document.querySelector(
    'input[name="radioTime"]:checked'
  ).value;
  var city = $("#city-search-input").val();
  selectedDate = datePicker.value;
  console.log(selectedDate);
  $("#header-date").text(moment(selectedDate).format("MMM Do, YYYY"));
  selectedDateDay = moment(selectedDate).date();
  //gets the selectedDate's day
  dayValue = forecastLimit - selectedDateDay;
  //checkWithinForeCast(selectedDate);
  //console.log(radioTime);
  //creates the time parameter for the music query

  if (radioTime === "day") {
    startTime = "03:00:00";
    endTime = "15:00:00";
  } else if (radioTime === "night") {
    startTime = "15:00:01";
    endTime = "23:59:59";
  } else if (radioTime === "allDay") {
    startTime = "03:00:00";
    endTime = "23:59:59";
  }

  //console.log(startTime);
  //console.log(endTime);
  //console.log(selectedDate);
  //console.log(city);

  //sets search parameter displays
  fetchData(city);
});

function fetchData(city) {
  storeCity(city);
  $("#header-city").html(city);
  fetchWeatherData(city);
  fetchMusicData(city);
  renderCityButtons();
  selectedDate = datePicker.value;
  $("#header-date").text(moment(selectedDate).format("MMM Do, YYYY"));
}
//queries initial values for page load

initParameters();

//function that pulls initially for first page load
function initParameters() {
  var storedCities = JSON.parse(localStorage.getItem("cityList"));
  console.log(storedCities);

  if (storedCities !== null) {
    cityList = storedCities;
  }

  $("#header-date").text(moment().format("MMM Do, YYYY"));
  var city = "Atlanta";
  $("#header-city").html(city);
  fetchWeatherData(city);
  fetchMusicData(city);
  renderCityButtons();
}

//stores city in city List
function storeCity(city) {
  cityList.push(city);
  console.log(cityList);
  //storedCities.push(cityList);
  cityList = [...new Set(cityList)];
  localStorage.setItem("cityList", JSON.stringify(cityList));
}

//renders city buttons
function renderCityButtons() {
  cityListEl.innerHTML = "";
  //Will only display the first 4 searches
  if (cityList.length > 4) {
    cityList.pop();
  }
  for (var i = 0; i < cityList.length; i++) {
    var button = document.createElement("button");
    button.classList = "btn btn-search collection-item";
    button.textContent = cityList[i];
    $(".collection-item").click(function () {
      var city = $(this)[0].textContent;
      fetchData(city);
    });
    cityListEl.appendChild(button);
  }
}

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
      //console.log(data);
      getForecast(data.coord.lat, data.coord.lon);
      //console.log(data);
    });
}

//generates music query URL
function fetchMusicData(city) {
  var queryMusicURL =
    "https://app.ticketmaster.com/discovery/v2/events?apikey=" +
    musicAPI +
    "&classificationName=Music" +
    "&city=" +
    city +
    "&locale=*" +
    "&startDateTime=" +
    selectedDate +
    "T" +
    startTime + "Z";
    //this broke need to fix
    //"Z&endDateTime=" +
    //selectedDate +
    //"T" +
    //endTime +
    //"Z";
  //will take parameter inputs to create query URL.
  //if loop here.
  console.log(queryMusicURL);
  //fetches TicketMaster API data based on inputed parameters
  fetch(queryMusicURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //console.log(data);
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
  //clears event cards
  eventsSection.innerHTML = "";
  var eventsList = data._embedded.events;
  //console.log(eventsList);
  for (var i = 0; i < eventsList.length; i++) {
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
    createTitle.textContent =
      data._embedded.events[i]._embedded.attractions[0].name;
    createTitle.setAttribute("class", "eventname");
    //console.log(createTitle);
    //appends the title element to the child
    createCard.appendChild(createTitle);

    //creates img element and sets it - appends to card
    createImg.setAttribute("id", "img-" + i);
    createImg.src = data._embedded.events[i].images[0].url;
    //console.log(createImg);
    createImg.setAttribute("class", "eventpic");
    createCard.appendChild(createImg);

    //sets venue attribute and text content
    createVenue.setAttribute("id", "venue-" + i);
    createVenue.textContent = data._embedded.events[i]._embedded.venues[0].name;
    createVenue.setAttribute("class", "venue");
    //console.log(createVenue);
    //appends the venue element to the child
    createCard.appendChild(createVenue);

    createTime.setAttribute("id", "time-1" + i);
    createTime.textContent = data._embedded.events[i].dates.start.localTime;
    createTime.setAttribute("class", "time");
    //console.log(createTime);
    //changing event time from 24 hour to 12-hour and adding am/pm
    var timechange = createTime.innerText;
    //console.log(timechange);
    timechange = moment(timechange, "HH:mm:ss").format("hh:mm a");
    //console.log(timechange);
    createTime.innerText = timechange;
    //appends the time element to the child
    createCard.appendChild(createTime);

    //sets site button attribute and creates link
    createSiteLink.setAttribute("id", "link-" + i);
    var linkurl = data._embedded.events[i].url;
    //console.log(linkurl);
    createSiteLink.textContent = "site";
    createSiteLink.setAttribute("href", linkurl);
    createSiteLink.setAttribute("class", "sitebutton");
    createSiteLink.setAttribute("style", "text-decoration: none");
    createSiteLink.setAttribute("target", "_blank");
    //console.log(createSiteLink);
    //appends the button element to the child
    createCard.appendChild(createSiteLink);
  }
}
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
          //console.log(data);
          //displayWeather function call here
          //displayWeather(data);
          printForecast(data);
        });
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}
//prints forecast data
function printForecast(data) {
  var iValue = 0;
  if (dayValue <= 5) {
    for (var i = 0; i < dayValue; i++)
     iValue++;
  }
  
  console.log(iValue);
  console.log(dayValue);
  var temp = Math.round(data.daily[iValue].temp.day);
  var weathericon = data.daily[iValue].weather[0].icon;
  var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
  $("#temp").html(temp + "°F");
  $("#weather-icon").html("<img class='icon' src=" + iconurl + ">");
}
