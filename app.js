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
    computerTurn(1);
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
  updateIterations(1);
  userInput = [];
  computerInput = [];
  currentSpeed = lowSpeed;
  currentBreak = lowBreak;
  turnLightsOff();
}

function computerTurn(iter) {
  if (state === "off") {
    turnLightsOff();
    return;
  }
  if (iter === iterations) {
    whoseTurn = "computer";
    computerInput.push(Math.floor(Math.random()*4));
  }
  console.log(computerInput);
  switch(computerInput[iterations-iter]) {
    case(0): lightGreen(); break;
    case(1): lightRed(); break;
    case(2): lightYellow(); break;
    case(3): lightBlue(); break;
  }
  setTimeout(function() {
    if (state === "running") {
      turnLightsOff();
      if (iter === 0) {
        userTurn();
        return;
      } else {
        setTimeout(function() {
          computerTurn(iter-1);
        }, currentBreak);
      }
    }
  }, currentSpeed);
}

function userTurn() {
  whoseTurn = "user";
  userInput = [];
}

function userClick(button) {
  if (state === "running" && whoseTurn === "user"){
    console.log(button);
    userInput.push(button);
    if (userInput[userInput.length-1] !== computerInput[userInput.length-1]){
      userLoss();
    } else if (userInput.length === computerInput.length) {
      updateIterations(iterations+1);
      computerTurn(iterations+1);
    }
  }
}

function userLoss() {
  $("#num-circle").css("animation-play-state", "paused");
  console.log("lost");
}

function turnLightsOff() {
  $("#green-light").css("fill", "#2b592e");
  $("#red-light").css("fill", "#821709");
  $("#yellow-light").css("fill", "#937D0C");
  $("#blue-light").css("fill", "#13546B");
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
$("#green-button").click(function(){userClick(0);});
$("#red-button").click(function(){userClick(1);});
$("#yellow-button").click(function(){userClick(2);});
$("#blue-button").click(function(){userClick(3);});
