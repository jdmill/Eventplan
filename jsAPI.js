//Open Weather API Key
var weatherAPI = "c05979fd50e5119c43cbd3ab81fe852f";
//TicketMaster API Explorer v2.0
var musicAPI = "BZZo8qKtqkk1hGSW6C14VUHCfMKAfSgz";

//inits var
var city = "";
var todayDate = "";

//search bar button that takes input and passes it to fetch city data.
$(".search-bar").submit(function (event) {
  event.preventDefault();
  var city = $("#city-search-input").val();
  fetchWeatherData(city);
});

//fetch data from OpenWeather API based on search bar input
function fetchWeatherData(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      convertDate(data);
      currentDay.innerHTML = data.name + " " + todayDate;
      getForecast(data.coord.lat, data.coord.lon);
      //need to pass in function to retrieve Ticket Master API information based on lat and Lon
      fetchMusicData(data.coord.lat, data.coord.lon);
      console.log(data);
    });
}

function fetchMusicData(lat, lon) {
  
}

  
//function the retrieves forecast data from openweather API based on lat & lon
function getForecast(lat, lon) {
  var getForecastUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=c05979fd50e5119c43cbd3ab81fe852f&units=imperial";

  fetch(getForecastUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayWeather(data);
        });
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

//function that will parse weather data and display somewhere on the page
function displayWeather(data) {

}

  
//converts unix time stamp to DD/MM/YYYY format and displays
function convertDate(data) {
  var unixTimeStamp = data.dt;
  console.log(unixTimeStamp);
  var date = new Date(unixTimeStamp * 1000);
  todayDate =
    "(" +
    date.getDate() +
    "/" +
    date.getMonth() +
    1 +
    "/" +
    date.getFullYear() +
    ")";

  return todayDate;
}
