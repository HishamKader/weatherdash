var cityInput = $("#cityInput");
var unitSelected;
var unit = "F";
var unit2 = "mph";


// Check if there's a stored value for the temperature unit preference
var storedUnit = localStorage.getItem("temperatureUnit");

// If there's a stored value, use it; otherwise, default to Fahrenheit
var isFahrenheit = (storedUnit === "C") ? false : true;


// Update unit and unit2 based on the initial stored value
if (!isFahrenheit) {
    unit = "C";
    unit2 = "m/s";
}

$(".units").on("click", "button", function () {
    unitSelected = $(this).attr("value");

    if (unitSelected === "F˚") {
        isFahrenheit = false;
        unit = "F";
        unit2 = "mph";
    } else {
        isFahrenheit = true;
        unit = "C";
        unit2 = "m/s";
    }

    // Store the selected unit preference in local storage
    localStorage.setItem("temperatureUnit", isFahrenheit ? "F" : "C");
});

// Function to switch between Fahrenheit and Celsius
function toggleTemperatureUnit() {
    isFahrenheit = !isFahrenheit;
    if (isFahrenheit) {
        unit = "F";
        unit2 = "mph";
    } else {
        unit = "C";
        unit2 = "m/s";
    }
    setWeather($("#cityName").text()); // Update weather data with new units
    // Store the toggled unit preference in local storage
    localStorage.setItem("temperatureUnit", isFahrenheit ? "F" : "C");
}

// Attach click event to toggle temperature unit button
$(".units").on("click", toggleTemperatureUnit);


setWeather("New Jersey");

function getCurrentLocationWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            setWeatherByLocation(latitude, longitude);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");

    }
}



$("#localBtn").on("click", function (e) {
    getCurrentLocationWeather();
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

$(document).ready(function() {
    var lastCity = localStorage.getItem("lastCityWeather");
    if (lastCity) {
        setWeather(lastCity);
    }
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


        var longDate = fullDate(response.list[0].dt);
        var noDec = Math.floor(response.list[0].main.temp);
        var min = Math.floor(response.list[0].main.temp_min)
        var max = Math.floor(response.list[0].main.temp_max)
        var wind = (response.list[0].wind.speed)
        var weatherDes = (response.list[0].weather[0].description)

        $("#cityName").text(response.city.name);
        $("#temperature").html(noDec + "&#730" + unit);
        $("#main_weather").text(response.list[0].weather[0].main)
        $("#humidity").text(response.list[0].main.humidity);
        $("#wind").text(wind + unit2);
        $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png");
        $("#dateString").text(longDate);

        $("#feels").html(response.list[0].main.feels_like + "&#730" + unit);
        $("#max").html(max + "&#730" + unit);
        $("#min").html(min + "&#730" + unit);
        $("#weatherDes").html(weatherDes)

        getDailyForecast(city);

        localStorage.setItem("lastCityWeather", city);

        function getDailyForecast(city) {

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                $("#forecastDays").empty();


                for (var i = 0, j = 1; i < response.list.length, j <= 5; i += 8, j++) {

                    var dateTime = convertDate(response.list[i].dt);
                    var noDec2 = Math.floor(response.list[i].main.temp);
                    var newDiv = $("<div>").attr("id", "day" + j);
                    var pTemp = $("<h4>");
                    var pHumid = $("<div>");
                    var iconImage = $("<img>");
                    var des = $("<p>")
                    var weatherId = (response.list[i].weather[0].main);


                    $("#day1 h6").text("Today");
                    $(".display-section").attr("id", response.list[0].weather[0].main);
                    $(".navbar-brand").attr("id", response.list[0].weather[0].main);
                    newDiv.addClass("col-lg-0").appendTo("#forecastDays");
                    newDiv.addClass("" + weatherId).appendTo("#forecastDays");
                    newDiv.html("<h6>" + dateTime + "</h6>").appendTo(newDiv);
                    pTemp.html(noDec2 + "&#730" + unit).appendTo(newDiv);
                    pHumid.html('<i class="fas fa-smog"></i>' + response.list[i].main.humidity + "%").appendTo(newDiv);
                    iconImage.attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png").appendTo(newDiv);
                    des.text(weatherId).appendTo(newDiv);

                }

            });
        }
    });
}


function setWeatherByLocation(latitude, longitude) {

    var queryURL;
    if (isFahrenheit) {

        queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=b774102802580c232f4e227fa165c18f";
    } else {

        queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=b774102802580c232f4e227fa165c18f";
    }
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        var lattitude = response.city.coord.lat;
        var longitude = response.city.coord.lon;

        getUVI(lattitude, longitude);

        var longDate = fullDate(response.list[0].dt);
        var noDec = Math.floor(response.list[0].main.temp);
        var min = Math.floor(response.list[0].main.temp_min)
        var max = Math.floor(response.list[0].main.temp_max)
        var wind = (response.list[0].wind.speed)


        $("#cityName").text(response.city.name);
        $("#temperature").html(noDec + "&#730" + unit);
        $("#main_weather").text(response.list[0].weather[0].main)
        $("#humidity").text(response.list[0].main.humidity);
        $("#wind").text(wind + unit2);
        $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png");
        $("#dateString").text(longDate);
        $("#feels").html(response.list[0].main.feels_like + "&#730" + unit);
        $("#max").html(max + "&#730" + unit);
        $("#min").html(min + "&#730" + unit);

        $("#forecastDays").empty();


        for (var i = 0, j = 1; i < response.list.length, j <= 5; i += 8, j++) {

            var dateTime = convertDate(response.list[i].dt);
            var noDec2 = Math.floor(response.list[i].main.temp);
            var newDiv = $("<div>").attr("id", "day" + j);
            var pTemp = $("<h4>");
            var pHumid = $("<div>");
            var iconImage = $("<img>");
            var des = $("<p>")
            var weatherId = (response.list[i].weather[0].main);


            $("#day1 h6").text("Today");
            $(".display-section").attr("id", response.list[0].weather[0].main);
            $(".navbar-brand").attr("id", response.list[0].weather[0].main);
            newDiv.addClass("col-lg-0").appendTo("#forecastDays");
            newDiv.addClass("" + weatherId).appendTo("#forecastDays");
            newDiv.html("<h6>" + dateTime + "</h6>").appendTo(newDiv);
            pTemp.html(noDec2 + "&#730" + unit).appendTo(newDiv);
            pHumid.html('<i class="fas fa-smog"></i>' + response.list[i].main.humidity + "%").appendTo(newDiv);
            iconImage.attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png").appendTo(newDiv);
            des.text(weatherId).appendTo(newDiv);

        }
    });
}

function getUVI(lattitude, longitude) {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lattitude + "&lon=" + longitude + "&appid=b774102802580c232f4e227fa165c18f";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var uvi = parseFloat(response.value);

        $("#uvindex").html(uvi);

        if (uvi >= 0 && uvi <= 2) {

            $("#uvindex").removeClass();
            $("#uvindex").addClass("uvi favorable");
        }
        else if (uvi > 2 && uvi <= 5) {

            $("#uvindex").removeClass();
            $("#uvindex").addClass("uvi moderate");

        }
        else if (uvi > 5 && uvi <= 10) {

            $("#uvindex").removeClass();
            $("#uvindex").addClass("uvi severe")
        }


    });
}

function fullDate(date) {

    var newDate = new Date(date * 1000);
    var newDateFormat = newDate.toDateString();

    return newDateFormat;
}

function convertDate(date) {

    var weekDay = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat"
    }
    var newDate = new Date(date * 1000);
    var dayDate = newDate.getDay()
    var day = weekDay[dayDate]

    return day;
}

$(document).ready(function () {

    var darkModeEnabled = localStorage.getItem('darkModeEnabled');

    // Apply dark mode if it was enabled previously
    if (darkModeEnabled === 'true') {
        $('body').addClass('dark-mode');
        $('.container h3, .cityPicker td').addClass('dark-mode-text')
        $('.user-section').addClass('dark-table');
        $('#submitBtn').addClass('dark-mode-button')
        $('#cityInput').addClass('dark-mode-input')
    }

    // Dark mode toggle
    $('#dark-mode-toggle').click(function () {
        $('body').addClass('dark-mode');
        $('.container h3, .cityPicker td').addClass('dark-mode-text')
        $('.user-section').addClass('dark-table');
        $('#submitBtn').addClass('dark-mode-button')
        $('#cityInput').addClass('dark-mode-input')

        localStorage.setItem('darkModeEnabled', 'true');
    });

    // Light mode toggle
    $('#light-mode-toggle').click(function () {
        $('body').removeClass('dark-mode');
        $('.container h3, .cityPicker td').removeClass('dark-mode-text')
        $('.user-section').removeClass('dark-table');
        $('#submitBtn').removeClass('dark-mode-button')
        $('#cityInput').removeClass('dark-mode-input')

        localStorage.setItem('darkModeEnabled', 'false');
    });
});
