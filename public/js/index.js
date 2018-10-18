// Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);


$(function() {
  var geocoder = new google.maps.Geocoder();
  $("#submit").on("click", function(event) {


//Click function to send GET request to BandsInTown API. Dynamically isplay 12 concerts. 
$(function () {
  $("#submit").on("click", function (event) {

    event.preventDefault();

    var band = $("#name").val();
    console.log(band)
    var URL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    $.ajax({
      url: URL,
      method: "GET",
  
    }).then(function (response) {
      // createDivs.addClass("cardRow");

      var artistName = $("#name").val().trim();
      $(".artistName").append(artistName);
      console.log(artistName);


      // Loops through the events and adds them to the event rows
      for (var i = 0; i < 12; i++) {
        var data = `
        <p> ${response[i].venue.city}<p>
        <p> ${response[i].venue.name}<p>
        <p> ${response[i].datetime}<p>
    
        `;
        var createDivs= $("<div>").addClass("col sm12 m3");
        createDivs.append(data);

        $("#events").append(createDivs);
      };
      //empty out input field after submission
      document.getElementById("name").reset();

    })
  });
  geocoder.geocode({ address: "charlotte" }, function (results) {
    map.setCenter(results[0].geometry.location);
    map.setZoom(15);
    // then places the markers on the map
    search();
});
});