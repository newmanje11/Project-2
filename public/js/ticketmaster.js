$(document).on("click", ".concerts", function () {
    event.preventDefault();
    console.log("I've been clicked");

    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Fst7jzMSw05CNr3UdA1wrZAywnNi0A3j";

    var startDate = "2018-10-01T01:00:00Z";
    var endDate = "2019-12-31T21:59:00Z";
    var limit = 10;
    var currEle = $(this)
    var city = currEle[0].childNodes[1].innerText;
    // console.log(city);

    
    $.ajax({
        url: queryURL,
        method: "GET",
        data: {
            city: city,
            startDateTime: startDate,
            endDateTime: endDate,
            size: limit,
            locale: "en"
        }
    }).then(function (response) {

        console.log(response);
        //   console.log(response._embedded.events);
    });
});
