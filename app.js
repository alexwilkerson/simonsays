var state = "off";
var strictMode = 0;
var iterations = 0;
var whoseTurn = "computer";

var lowSpeed = 850;
var midSpeed = 650;
var highSpeed = 500;
var currentSpeed = lowSpeed;
var currentBreak = 100;

var userInput = [];
var computerInput = [];

function clickStart() {
  if (state === "off") {
    state = "running";
    reset();
    $("#num-circle").css("animation-play-state", "running");
    $("#start-text").attr("transform", "translate(66.35 181.8)");
    $("#start-text").text("STOP");
    computerTurn(1);
  } else {
    state = "off";
    $("#num-circle").css("animation-play-state", "paused");
    $("#start-text").attr("transform", "translate(61.35 181.8)");
    $("#start-text").text("START");
    turnLightsOff();
  }
}

function clickStrict() {
  if (strictMode === 0) {
    $("#strict-on-off").attr("x", "12.5");
    $("#strict-on-off").text("ON");
    strictMode = 1;
  } else {
    $("#strict-on-off").attr("x", "9.99");
    $("#strict-on-off").text("OFF");
    strictMode = 0;
  }
}

function reset() {
  whoseTurn = "computer";
  updateIterations(1);
  userInput = [];
  computerInput = [];
  currentSpeed = lowSpeed;
  turnLightsOff();
  $("#start-text").removeClass("hidden");
  $("#win-screen").addClass("hidden");
  $("#lose-screen").addClass("hidden");
}

function computerTurn(iter) {
  if (state === "off") {
    turnLightsOff();
    return;
  }
  if (iter === 0) {
    turnLightsOff();
    userTurn();
    return;
  }
  if (iter === iterations) {
    if (state !== "loss") {
      updateIterations(iterations);
      computerInput.push(Math.floor(Math.random()*4));
    } else {
      state = "running";
    }
    whoseTurn = "computer";
  }
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
      computerTurn(iterations+1);
    }
  }
}

function userLoss() {
  state = "loss";
  var flashTime = 500;
  $("#start-text").addClass("hidden");
  $("#lose-screen").removeClass("hidden");
  setTimeout(function() {
    $("#lose-screen").addClass("hidden");
    setTimeout(function() {
      $("#lose-screen").removeClass("hidden");
      setTimeout(function() {
        $("#lose-screen").addClass("hidden");
        setTimeout(function() {
          $("#start-text").removeClass("hidden");
          if (strictMode === 0) {
            userInput = [];
          } else {
            reset();
            state = "running";
          }
          computerTurn(iterations);
        }, flashTime);
      }, flashTime);
    }, flashTime);
  }, flashTime);
}

function turnLightsOff() {
  $("#green-light").removeClass("green-light-on");
  $("#red-light").removeClass("red-light-on");
  $("#yellow-light").removeClass("yellow-light-on");
  $("#blue-light").removeClass("blue-light-on");
}

function lightGreen() {
  $("#green-light").addClass("green-light-on");
}

function lightRed() {
  $("#red-light").addClass("red-light-on");
}

function lightYellow() {
  $("#yellow-light").addClass("yellow-light-on");
}

function lightBlue() {
  $("#blue-light").addClass("blue-light-on");
}

function updateIterations(num) {
  iterations = num;
  $(".num-field").text((num<10) ? "0" + num : num);
}

$(document).ready(function(){
  $("#start-button").click(function(){clickStart();});
  $("#green-corner").click(function(){userClick(0);});
  $("#red-corner").click(function(){userClick(1);});
  $("#yellow-corner").click(function(){userClick(2);});
  $("#blue-corner").click(function(){userClick(3);});
  $("#strict-mode").click(function(){clickStrict();});
});
