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

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var lattitude = response.city.coord.lat;
        var longitude = response.city.coord.lon;

        getUVI(lattitude, longitude);

        var dateTime = convertDate(response.list[0].dt);

        $("#cityName").text(response.city.name);
        $("#temperature").html(response.list[0].main.temp + " &#730" + unit);
        $("#main_weather").text(response.list[0].weather[0].main)
        $("#humidity").text(response.list[0].main.humidity);
        $("#wind").text(response.list[0].wind.speed);
        $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png");
        $("#dateString").text(dateTime);
        $("#feels").html(response.list[0].main.feels_like + " &#730" + unit);
        $("#max").html(response.list[0].main.temp_max + " &#730" + unit);
        $("#min").html(response.list[0].main.temp_min + " &#730" + unit);

        getDailyForecast(city);
    }
    