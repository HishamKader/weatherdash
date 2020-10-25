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