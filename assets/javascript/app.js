// This function handles events where SEARCH button is clicked
$("#search-btn").on("click", function(event) {
  event.preventDefault();

  function clearInput() {
    // clears input area for next entry
    $("#search-input").val("");
  }

  // This line will grab the text from the input box
  var userInput = $("#search-input")
    .val()
    .trim();

  // Input validation
  if (userInput.length > 1) {
    // Calling functions to create cards and clear input
    renderCards();
    clearInput();
  } else {
    alert("Please enter a word longer than 1 character.");
    clearInput();
  }
});

// BEGIN YELP API //

function renderCards() {
  // This will change, just hard-coded for now
  var where = "poconos";

  var numResults = 6;

  // Here we have an empty array to push the results into IF they match 'alias: "skiresorts"
  var resortsArray = [];

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
    // console.log(response);

    var results = response.businesses;

    // displayCards();
    $("#resortsDiv").empty();

    // First for-loop will loop through results and add businesses into resortsArray IF they match alias: skiresorts
    for (var i = 0; i < results.length; i++) {
      if (results[i].categories[0].alias === "skiresorts") {
        console.log("omg this matches");
        resortsArray.push(results[i]);
      }
    }

    console.log(resortsArray);

    // Second for-loop will loop through resortsArray and dynamically create cards for the first 3 results

    for (var i = 0; i < numResults; i++) {
      console.log(resortsArray[i]);
      var name = resortsArray[i].name;
      console.log("name: " + name);
      var longitude = resortsArray[i].coordinates.longitude;
      // console.log("long: " + longitude);
      var latitude = resortsArray[i].coordinates.latitude;
      // console.log("lat: " + latitude);
      var imageURL = resortsArray[i].image_url;
      // console.log("img url: " + imageURL);
      var phone = resortsArray[i].display_phone;
      // console.log("phone: " + phone);
      var rating = resortsArray[i].rating;
      // console.log("rating: " + rating);
      var address = resortsArray[i].location.address1;

      var card = $("<div>");
      card.addClass("card border-info mb-3 form-rounded");

      var cardHeader = $("<div>");
      cardHeader.addClass("card-header form-rounded");
      cardHeader.text(rating);

      var cardImage = $("<img>");
      cardImage.addClass("card-img-top");
      cardImage.attr("src", imageURL);

      var cardBody = $("<div>");
      cardBody.addClass("card-body");

      var title = $("<h4>");
      title.text(name);
      title.addClass("card-title");

      var paragraph1 = $("<p>");
      paragraph1.text(address);
      paragraph1.addClass("card-text");

      var paragraph2 = $("<p>");
      paragraph2.text(phone);
      paragraph2.addClass("card-text");

      cardBody.append(cardImage);
      cardBody.append(title);
      cardBody.append(paragraph1);
      cardBody.append(paragraph2);
      card.append(cardHeader);
      card.append(cardBody);

      $("#resortsDiv").append(card);
    }
  });
}

// BEGIN WEATHER API //

function renderWeather() {
  // BEGIN WEATHER API //
  // var APIKey = "51deb09fc20d171f26bffd5637e7878c";
  // // This will be the user input postal code
  // var latCoord = "40";
  // var lonCoord = "75";
  // function displayWeather() {
  //     // Here we are building the URL we need to query the database
  //     var queryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + latCoord + "&lon=" + lonCoord + "&appid=" + APIKey;
  //     console.log("url: " + queryURL);
  //     // Here we run our AJAX call to the OpenWeatherMap API
  //     $.ajax({
  //         url: queryURL,
  //         method: "GET"
  //     })
  //         // We store all of the retrieved data inside of an object called "response"
  //         .then(function (response) {
  //             // Log the resulting object
  //             console.log(response);
  //             $("#resort-cards").empty();
  //             // Converting Kelvin to Farenheit
  //             var tempK = response.main.temp;
  //             var tempF = ((tempK - 273.15) * 1.8 + 32);
  //             console.log("f temp: " + tempF);
  //             // Converting meters/sec to miles/hour (wind)
  //             var metSec = response.wind.speed;
  //             var milesHr = response.wind.speed * 2.237;
  //             console.log("mph: " + milesHr)
  //             // Making a new card
  //             var newcard = $("<div>");
  //             // Add bootstrap class to card
  //             // Insert weather data into card
  //             // Transfer content to HTML
  //             $(".city").html("<h1>" + response.name + " Weather Details</h1>");
  //             $(".wind").text("Wind Speed: " + tempF.toFixed(2) + " MPH");
  //             $(".clouds").text("Clouds: " + response.clouds.all + "%");
  //             $(".temp").text("Temperature: " + tempF.toFixed(2) + " F");
  //             // Log the data in the console as well
  //             console.log("Wind Speed: " + response.wind.speed);
  //             console.log("Humidity: " + response.main.humidity);
  //             console.log("Temperature (F): " + response.main.temp);
  //         });
  // }
}

// // When buttons with a class of 'resort' are clicked, call the displayWeather function
// $(document).on("click", ".resort", renderWeather);