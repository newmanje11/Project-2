// Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
//firebase config

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD937MlgcJiQIwVpX_UYcaqjUjn2O19vxk",
  authDomain: "project-2-9f2fd.firebaseapp.com",
  databaseURL: "https://project-2-9f2fd.firebaseio.com",
  projectId: "project-2-9f2fd",
  storageBucket: "project-2-9f2fd.appspot.com",
  messagingSenderId: "518120117449"
};

firebase.initializeApp(config);


var database = firebase.database();



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

$(function () {
  var geocoder = new google.maps.Geocoder();
  $("#submit").on("click", function (event) {
    event.preventDefault();
    console.log("here");
    var band = $("#name").val();
    console.log(band)
    var URL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    $.ajax({
      url: URL,
      method: "GET"
    }).then(function (response) {
      var date = response[0].datetime
      $.ajax({
        method: "GET",
        url: "/band/date"
      })
        .then(function (date) {
          console.log(date);
        });
    })

  });

  geocoder.geocode({ address: "charlotte" }, function (results) {
    map.setCenter(results[0].geometry.location);
    map.setZoom(15);
    // then places the markers on the map
    search();
  });

  $("#signup").on("click", function () {
    event.preventDefault();
    email = $("#idsignup").val();
    password = $("#passsignup").val();
    console.log(email);
    console.log(password);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
      window.location.href = "/artist"
      number = email.indexOf("@");
      user = email.slice(0, number);
      localStorage.setItem("user", user);
      database.ref(user).set({
        events: "",
        signon: true,
        eventCount: 0,
      });

      database.ref("logstatus").set("on");
    })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  });
  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid);
    }
  });

  $('#signin').on("click", function () {
    email = $("#email").val();
    password = $("#password").val();
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
      window.location.href = "/artist"
      number = email.indexOf("@");
      user = email.slice(0, number);
      localStorage.setItem("user", user);
      database.ref("logstatus").set("on");
    })
      .catch(function (error) {
        // Handle Errors here.
        $("#error").text("Incorrect email or password")
        $("#error").css({ "color": "red" })
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  });  
});