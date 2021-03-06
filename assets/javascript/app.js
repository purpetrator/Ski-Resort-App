var userInput;
$("#weatherDiv").hide();
$("#loading").hide();

// This function handles events where SEARCH button is clicked
$("#search-btn").on("click", function(event) {
  event.preventDefault();

  $("#resortsDiv").empty();
  $("#loading").show();

  // This line will grab the text from the input box
  userInput = $("#search-input")
    .val()
    .trim();

  // Input validation
  if (userInput.length > 4) {
    // Calling functions to create cards and clear input
    renderCards(userInput);
    clearInput();
    clearWeather();
  } else {
    alert("Please enter a proper zip code");
    clearInput();
    clearWeather();
  }
});

function clearInput() {
  // clears input area for next entry
  $("#search-input").val("");
}

function clearWeather() {
  // clears input area for next entry
  $("#weatherDiv").hide();
}

// BEGIN YELP API //

// Here we have an empty array to push the results into IF they match 'alias: "skiresorts"

var resortsArr = [];
var sortedArr = [];
var resultsOriginal = [];

function renderCards(zipcode) {
  var where = userInput;

  var numResults = 6;
  var resortsArray = [];
  sortedArr = [];
  resortsArr = [];

  var queryURL =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" +
    where +
    "&term=ski+resort";

  $.ajax({
    url: queryURL,
    method: "GET",
    headers: {
      Authorization:
        "Bearer K5vhwq6zYBL4NEpBTf2KN1b7BKB3P1ofVlp_BVJxNVWTxOZpQT05QQv3qKrYyW0hu7sHEBbtd-fVHpx3nu3bGtp2OjcJVUVC8isF-RlthbBF_2ZoJYUWAGHGzRe7XXYx"
    }
  }).then(function(response) {
    var results = response.businesses;

    $("#resortsDiv").empty();
    $("#loading").hide();

    // First for-loop will loop through results and add businesses into resortsArray IF they match alias: skiresorts
    for (var i = 0; i < results.length; i++) {
      if (results[i].categories[0].alias === "skiresorts") {
        console.log("omg this matches");
        resortsArr.push(results[i]);
      }
    }

    //saves the original results in a global variable so they can be displayed again later
    resultsOriginal = resortsArr.slice(0);

    //calling sortByRating function (test)
    sortedArr = sortByRating(resortsArr);

    resortsDisplay(resultsOriginal, numResults);

    if (resortsArr.length == 0) {
      $("#resortsDiv").text("Sorry, there are no results within 25 miles.");
    }
  });
}

// BEGIN WEATHER API //

function renderWeather() {
  var APIKey = "51deb09fc20d171f26bffd5637e7878c";

  // This will need to pull the lat/lon from the object associated with the card
  var latCoord = $(this).attr("lat");
  var lonCoord = $(this).attr("lon");

  // Here we are building the URL we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latCoord +
    "&lon=" +
    lonCoord +
    "&appid=" +
    APIKey;
  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
      $("#weatherDiv").show();
      // Log the resulting object
      $("#resort-cards").empty();

      // $("#resortsDiv").empty();
      // Converting Kelvin to Farenheit
      var tempK = response.main.temp;
      var tempF = (tempK - 273.15) * 1.8 + 32;

      // Converting meters/sec to miles/hour (wind)
      var milesHr = response.wind.speed * 2.237;

      var weatherIcon = response.weather[0].icon;

      var iconImage = $("<img>");
      iconImage.attr(
        "src",
        "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
      );

      // Making a new card
      var newDiv = $("<div>");
      // Add bootstrap class to card
      // Insert weather data into card
      // Transfer content to HTML
      $(".city").html("<h1>" + response.name + " Weather Details</h1>");
      $(".wind").text("Wind Speed: " + milesHr.toFixed(2) + " MPH");
      $(".clouds").text("Clouds: " + response.clouds.all + "%");
      $(".temp").text("Temperature: " + tempF.toFixed(2) + "º F");
      $(".description")
        .text(response.weather[0].description)
        .prepend(iconImage);
    });
}

// // When cards with a id of 'resort-card' are clicked, call the displayWeather function
$(document).on("click", "#weather-btn", renderWeather);
// $(document).on("click", "#resort-card", renderWeather);
function resortsDisplay(resortsArray, numResults) {
  $("#resortsDiv").empty();

  if (resortsArray.length < numResults) {
    numResults = resortsArray.length;
  }

  for (var i = 0; i < numResults; i++) {
    var name = resortsArray[i].name;
    var longitude = resortsArray[i].coordinates.longitude;
    var latitude = resortsArray[i].coordinates.latitude;
    var imageURL = resortsArray[i].image_url;
    var phone = resortsArray[i].display_phone;
    var rating = resortsArray[i].rating;
    var address = resortsArray[i].location.address1;

    var card = $("<div>");
    card.addClass("card border-info mb-3 form-rounded m-3 width");

    var cardHeader = $("<div>");
    cardHeader.addClass("card-header form-rounded");
    cardHeader.text("Rating: " + rating);
    cardHeader.append(" <i class='fa fa-star'></i>");

    var cardImage = $("<img>");
    cardImage.addClass("card-img-top mb-3");
    cardImage.attr("src", imageURL);
    cardImage.attr("id", "card-img");

    var cardBody = $("<div>");
    cardBody.addClass("card-body");
    cardBody.attr("id", "resort-card");

    var title = $("<h4>");
    title.text(name);
    title.addClass("card-title");

    var paragraph1 = $("<p>");
    paragraph1.text(address);
    paragraph1.addClass("card-text");

    var paragraph2 = $("<p>");
    paragraph2.text(phone);
    paragraph2.addClass("card-text");

    var cardButton = $("<button>");
    cardButton.text("Get Weather");
    cardButton.addClass("btn btn-info form-rounded");
    cardButton.attr("id", "weather-btn");
    cardButton.attr("lat", latitude);
    cardButton.attr("lon", longitude);

    cardBody.append(cardImage);
    cardBody.append(title);
    cardBody.append(paragraph1);
    cardBody.append(paragraph2);
    cardBody.append(cardButton);
    card.append(cardHeader);
    card.append(cardBody);

    $("#resortsDiv").append(card);
    $("#loading").hide();
  }
}

//on click function when the user clicks "Sort By Rating"
$(document).on("click", "#sort-rating", function() {
  resortsDisplay(sortedArr, 6);
});

//on click function when the user clicks "Default Results"
$(document).on("click", "#sort-default", function() {
  resortsDisplay(resultsOriginal, 6);
});

//Sort by rating function
function compare(a, b) {
  if (a.rating > b.rating) {
    return -1;
  }
  if (a.rating < b.rating) {
    return 1;
  }
  return 0;
}

function sortByRating(resultsArray) {
  for (var i = 0; i < resultsArray.length; i++) {
    console.log("resultsArray[" + i + "] is ");
    console.log(resultsArray[i]);
    console.log(
      "Rating of " + resultsArray[i].name + " is " + resultsArray[i].rating
    );
  }

  var sortedArray = resultsArray;
  sortedArray.sort(compare);

  return resultsArray;
}
