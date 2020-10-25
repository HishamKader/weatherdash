var cityInput = $("#cityInput");
var isFahrenheit = true;
var unitSelected;
var unit = "F";



setWeather("Beirut");


$(".units").on("click", "input", function () {

    unitSelected = $(this).attr("value");
    if (unitSelected === "fahrenheit") {

        isFahrenheit = true;

        unit = "F";
    } else {
        isFahrenheit = false;

        unit = "C";
    }
})

$("#submitBtn").on("click", function (e) {

    e.preventDefault();

    city = cityInput.val().trim();
    setWeather(city)
});

$("#cityList").on("click", "td", function (e) {

    var clicked = $(this).text();
    setWeather(clicked);
});

function setWeather(city) {

    if (isFahrenheit) {

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=b774102802580c232f4e227fa165c18f";
    } else {

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=b774102802580c232f4e227fa165c18f";
    }