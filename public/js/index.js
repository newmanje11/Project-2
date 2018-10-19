// The API object contains methods for each kind of request we'll make
//firebase config
var dateArray = [];
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
  bandsApi: () => {
    const band = $("#name").val();
    console.log(band)
    var URL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    $.ajax({
      url: URL,
      method: "GET",

    }).then((response) => {
      API.bandImage(band);
      var artistName = $("#name").val().trim();
      $(".artistName").empty();
      $(".artistName").append(artistName);
      $("#events").empty();
      $("#name").val("");


      // Makes artist search go away.
      $(".main-box").css("display", "none");

      for (var i = 0; i< 12; i++) {
        dateArray.push(response[i].datetime);
      }
      
      $.post("/band/date",{'':dateArray})
        .then((dateresponse) => {
        console.log(dateresponse)
      // Loops through the events and adds them to the event rows
      for (var i = 0; i < 12; i++) {
        var data = `
          <div class="col sm4">
           ${dateresponse.dates[i]} <br>
          ${dateresponse.times[i]} 
          </div>
          <div class="col sm4 offset-s3">
          ${response[i].venue.city} <br>
          ${response[i].venue.name}
          </div>

          <div class="col sm4 offset-s2">
          <button>Select Date:</button>
          
          </div>
         
          

          `;
        var createDivs = $("<div>").addClass("col s12");                                                                
        createDivs.append(data);
        $("#events").append(createDivs);
      };
      //empty out input field after submission
      document.getElementById("name").reset();
    })
  });
  },
  bandImage: (band) => {$.post("/band/image",{bandname:band}).then((responseimage) => {
               Img = new Image();
               Img.src = responseimage
               $(".bandimg").html(Img)
             }
  )},
  signIn: (email, password) => {
    console.log(`here`)
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
      window.location.href = "/artist"
    })
      .catch(function (error) {
        // Handle Errors here.
        $("#error").text("Incorrect email or password")
        $("#error").css({ "color": "red" })
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      })
  },
  createUser: (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      window.location.href = "/artist"
    })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
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

$(() => {
  var geocoder = new google.maps.Geocoder();

  $("#submit").on("click", function (event) {
    event.preventDefault();
    API.bandsApi();
  });

  geocoder.geocode({ address: "charlotte" }, function (results) {
    map.setCenter(results[0].geometry.location);
    map.setZoom(15);
    // then places the markers on the map
    search();
  });
//listeners
  $("#signup").on("click", () => {
    event.preventDefault();
    email = $("#idsignup").val();
    password = $("#passsignup").val();
    API.createUser(email, password);
  });

  $('#signin').on("click", () => {
    email = $("#email").val();
    password = $("#password").val();
    API.signIn(email, password);
  });
});

$(document).on("click", ".favhotel", () => {
  $("iw-address").text();
  $("iw-website").text();
  $("#iw-phone").text();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user.uid);
    localStorage.setItem("user", user.uid);
  }
});
