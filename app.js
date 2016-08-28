var state = "off";
var strictMode = 0;
var iterations = 0;
var whoseTurn = "computer";

var lowSpeed = 1100;
var midSpeed = 850;
var highSpeed = 600;
var lowBreak = 400;
var midBreak = 300;
var highBreak = 200;
var currentSpeed = lowSpeed;
var currentBreak = lowBreak;

var userInput = [];
var computerInput = [];

function clickStart() {
  if (state === "off") {
    state = "running";
    reset();
    $("#num-circle").css("animation-play-state", "running");
    $(".cls-26").attr("transform", "translate(66.35 181.8)");
    $(".cls-26").text("STOP");
    computerTurn(iterations);
  } else {
    state = "off";
    $("#num-circle").css("animation-play-state", "paused");
    $(".cls-26").attr("transform", "translate(61.35 181.8)");
    $(".cls-26").text("START");
    turnLightsOff();
  }
}

function reset() {
  whoseTurn = "computer";
  updateIterations(8); /// THIS IS FOR TESTING, SHOULD BE (1) not (8)
  userInput = [];
  computerInput = [];
  currentSpeed = lowSpeed;
  currentBreak = lowBreak;
  computerInput=[0,3,3,1,2,0,1,3]; /// THIS IS FOR TESTING, DELETE PLEASE
  turnLightsOff();
}

function turnLightsOff() {
  $("#green-light").css("fill", "#2b592e");
  $("#red-light").css("fill", "#821709");
  $("#yellow-light").css("fill", "#937D0C");
  $("#blue-light").css("fill", "#13546B");
}

function computerTurn(iter) {
  if (state === "off") {
    turnLightsOff();
    return;
  }
  if (iter === 0) {
    whoseTurn = "user";
    // USER TURN GOES HERE ############################
    return;
  }
  if (iter === iterations) {
    computerInput.push(Math.floor(Math.random()*4));
  }
  console.log(computerInput[iterations-iter]);
  switch(computerInput[iterations-iter]) {
    case(0): lightGreen(); break;
    case(1): lightRed(); break;
    case(2): lightYellow(); break;
    case(3): lightBlue(); break;
  }
  setTimeout(function() {
    if (state === "running") {
      turnLightsOff();
      setTimeout(function() {
        computerTurn(iter-1);
      }, currentBreak);
    }
  }, currentSpeed);
}

function lightGreen() {
  $("#green-light").css("fill", "#7DF585");
}

function lightRed() {
  $("#red-light").css("fill", "#FF3020");
}

function lightYellow() {
  $("#yellow-light").css("fill", "#FDD732");
}

function lightBlue() {
  $("#blue-light").css("fill", "#31B5E4");
}

function updateIterations(num) {
  iterations = num;
  $(".num-field").text((num<10) ? "0" + num : num);
}

$("#start-button").click(function(){clickStart();});
