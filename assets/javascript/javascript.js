// Initialize Firebase
var config = {
    apiKey: "AIzaSyCmUFXxJu890E5jpKAqvWHN12oiMIPL294",
    authDomain: "trainscheduler-26a71.firebaseapp.com",
    databaseURL: "https://trainscheduler-26a71.firebaseio.com",
    projectId: "trainscheduler-26a71",
    storageBucket: "trainscheduler-26a71.appspot.com",
    messagingSenderId: "222348283634"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#submit-train").on("click", function(event){
    event.preventDefault();

    var train = {
        name: $("#train-name").val().trim(),
        destination: $("#destination").val().trim(),
        firstTrain: $("#first-train-time").val().trim(),
        frequency: $("#frequency").val().trim(),
    }
    console.log(train);

    database.ref().push(train);
});

database.ref().on("child_added", function (snapshot){
    var train = snapshot.val();
    var key = snapshot.key;
    console.log(train);

    var trainName = train.name;
    var trainDestination = train.destination;
    var trainFrequency = train.frequency;
    var trainFirstTime = train.firstTrain;

    var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log(moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(diffTime);

    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log(tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log(nextTrain);

    var tableRow = $("<tr>");
    var tableName = $("<td>");
    var tableDestination = $("<td>");
    var tableFrequency = $("<td>");
    var tableNextArrival = $("<td>");
    var tableMinutesAway = $("<td>");

    tableRow.addClass("full-table");
    tableName.attr("scope", "row");

    tableName.text(trainName);
    tableDestination.text(trainDestination);
    tableFrequency.text(trainFrequency);
    tableNextArrival.text(nextTrain);
    tableMinutesAway.text(tMinutesTillTrain);


    tableRow.append(tableName);
    tableRow.append(tableDestination);
    tableRow.append(tableFrequency);
    tableRow.append(tableNextArrival);
    tableRow.append(tableMinutesAway);

    $("#tableBody").append(tableRow);
});

$("#delete-trains").on("click", function(event){
    event.preventDefault();

    database.ref().set(null);
});

database.ref().on("child_removed", function(event){
    $("#tableBody").empty()
});