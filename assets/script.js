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

        function getDailyForecast(city) {

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                $("#forecastDays").empty();

                for (var i = 0, j = 1; i < response.list.length, j <= 5; i += 8, j++) {

                    var dateTime = convertDate(response.list[i].dt);
                    var newDiv = $("<div>").attr("id", "day" + j);
                    var pTemp = $("<p>");
                    var pHumid = $("<p>");
                    var iconImage = $("<img>");

                    newDiv.attr("class", "col-lg-2").appendTo("#forecastDays");
                    newDiv.html("<h6>" + dateTime + "</h6>").appendTo(newDiv);
                    pTemp.html('<i class="fas fa-thermometer-full"></i>' + response.list[i].main.temp + " &#730" + unit).appendTo(newDiv);
                    pHumid.html('<i class="fas fa-smog"></i>' + response.list[i].main.humidity + "%").appendTo(newDiv);
                    iconImage.attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png").appendTo(newDiv);

                    $("#forecastDays").append(newDiv);
                }
            });
        }
    });
}
function getUVI(lattitude, longitude){
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+lattitude+"&lon=" +longitude+"&appid=b774102802580c232f4e227fa165c18f";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Pull our uvindex data from the JSON, store in variable uvi.
        var uvi = parseFloat(response.value);
        console.log(uvi);
        // Push uvi to the DOM.
        $("#uvindex").html(uvi);

        if(uvi >= 0 && uvi <= 2){
            
            $("#uvindex").removeClass();
            $("#uvindex").addClass("uvi favorable");
        }
        else if(uvi > 2 && uvi <= 5){
           
            $("#uvindex").removeClass();
            $("#uvindex").addClass("uvi moderate");

        }
        else if(uvi > 5 && uvi <= 10){
           
            $("#uvindex").removeClass();
            $("#uvindex").addClass("uvi severe")
        }

    });
}

function convertDate(date) {
    
    var newDate = new Date(date * 1000);
    var newDateFormat = newDate.toLocaleDateString();
   
    return newDateFormat;
}
