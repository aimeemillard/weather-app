//api key: 1a486b07e56b6f29eca902186a58a21d

$(document).ready(function () {
  //the previous searches
  var previousSearch = [];

  // last search
  if (localStorage.getItem("search") !== null) {
    var lastSearch = localStorage.getItem("search");
    previousSearch.push(lastSearch);
    search(lastSearch);
  }
  // search button
  $("#search-button").on("click", function () {
    previousSearch.push($("#city-search").val());
    search($("#city-search").val());
  });
  // previous searches.
  $(document).on("click", ".list-group-item", function (event) {
    event.preventDefault();
    search($(this).text());
    console.log($(this).text());
  });
  // organize searches
  function organizeSearch() {
    $(".list-group").empty();
    for (var i = 0; i < previousSearch.length; i++) {
      var newSearch = $("<li>");
      newSearch.addClass("list-group-item");
      newSearch.text(previousSearch[i]);
      $(".list-group").prepend(newSearch);
    }
  }

  //Funtcion for search
  function search(city) {
    localStorage.setItem("search", city);
    console.log(city);
    organizeSearch();
    //URLS
    var queryURLCurrent =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=1a486b07e56b6f29eca902186a58a21d";
    var queryURLForcast =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=1a486b07e56b6f29eca902186a58a21d";
    var lat;
    var lon;

    // get current weather
    $.ajax({
      url: queryURLCurrent,
      method: "GET",
    }).then(function (response) {
      // for uv index request
      lat = response.coord.lat;
      lon = response.coord.lon;

      var iconEl = $("<img>");
      $("#current-time-date").text(
        response.name + " " + moment().format("MM/DD/YYYY")
      );
      iconEl.attr(
        "src",
        "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );

      $("#current-time-date").append(iconEl);
      $("#current-temp").text("Temperature: " + response.main.temp + " F");
      $("#current-humid").text("Humidity: " + response.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
      var queryURLIndex =
        "http://api.openweathermap.org/data/2.5/uvi?appid=1a486b07e56b6f29eca902186a58a21d&lat=" +
        lat +
        "&lon=" +
        lon;
      $.ajax({
        url: queryURLIndex,
        method: "GET",
      }).then(function (response) {
        var uvIndex = response.value;
        var badgeColor;

        if (uvIndex > 7) {
          badgeColor = "badge-danger";
        } else if (uvIndex > 3) {
          badgeColor = "badge-warning";
        } else {
          badgeColor = "badge-success";
        }

        var colorEl = $("<span class = badge>" + uvIndex + "<span>");
        colorEl.addClass(badgeColor);

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(colorEl);
      });
    });

    // 5 day forcast
    $.ajax({
      url: queryURLForcast,
      method: "GET",
    }).then(function (response) {
      // loop 5 times over
      $(".card-deck").empty();
      for (var i = 1; i < 6; i++) {
        var newCardEl = $("<div class = 'card'></div>");
        var newCardBodyEl = $(
          "<div class = 'card-body text-white bg-primary mb-3 '></div>"
        );

        var time = moment().add(i, "d");
        var cardTitleEl = $(
          "<h5 class = 'card-title'>" + time.format("MM/DD/YYYY") + "<div>"
        );

        var iconEl = $("<img>");
        iconEl.attr(
          "src",
          "http://openweathermap.org/img/w/" +
            response.list[0].weather[0].icon +
            ".png"
        );
        var tempEl = $("<p>");
        tempEl.text("Temperature: " + response.list[i + 4].main.temp);
        var humidityEl = $("<p>");
        humidityEl.text("Humidity: " + response.list[i + 4].main.humidity);
        newCardBodyEl.append(cardTitleEl, iconEl, tempEl, humidityEl);

        newCardEl.append(newCardBodyEl);

        $(".card-deck").append(newCardEl);
      }
    });
  }
});
