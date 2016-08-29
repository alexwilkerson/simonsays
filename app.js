var state = "off";
var strictMode = 0;
var iterations = 0;
var whoseTurn;

var lowSpeed = 800;
var midSpeed = 600;
var highSpeed = 400;
var superDuperExtremeMaximumHighSpeed = 200;
var currentSpeed = lowSpeed;
var currentBreak = 100;

var userInput = [];
var computerInput = [];

var greenOsc, redOsc, yellowOsc, blueOsc;

var audio = new (window.AudioContext || window.webkitAudioContext)();

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
    $(".num-field").attr("transform", "translate(9.08 184.83)");
    $(".num-field").text("--");
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
  $(".num-field").attr("transform", "translate(5.08 186.83)");
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
    userInput.push(button);
    if (userInput[userInput.length-1] !== computerInput[userInput.length-1]){
      userLoss();
    } else if (userInput.length === computerInput.length) {
      if (iterations === 20) {
        userWin();
      } else {
        if (iterations === 4) {
          currentSpeed = midSpeed;
        } else if (iterations === 8) {
          currentSpeed = highSpeed;
        } else if (iterations === 12) {
          currentSpeed = superDuperExtremeMaximumHighSpeed;
        }
        updateIterations(iterations+1);
        computerTurn(iterations+1);
      }
    }
  }
}

function userWin() {
  state = "win";
  updateIterations(iterations);
  var flashTime = 500;
  $("#start-text").addClass("hidden");
  $("#win-screen").removeClass("hidden");
  lightGreen();
  setTimeout(function() {
    $("#win-screen").addClass("hidden");
    turnLightsOff();
    lightRed();
    setTimeout(function() {
      $("#win-screen").removeClass("hidden");
      turnLightsOff();
      lightBlue();
      setTimeout(function() {
        $("#win-screen").addClass("hidden");
        turnLightsOff();
        lightYellow();
        setTimeout(function() {
          $("#start-text").removeClass("hidden");
          turnLightsOff();
          reset();
          state = "running";
          computerTurn(iterations);
        }, flashTime);
      }, flashTime);
    }, flashTime);
  }, flashTime);
}

function userLoss() {
  state = "loss";
  var flashTime = 500;
  var errOsc = audio.createOscillator();
  errOsc.type = "square";
  errOsc.frequency.value = 73;
  errOsc.connect(audio.destination);
  errOsc.start();
  $("#start-text").addClass("hidden");
  $("#lose-screen").removeClass("hidden");
  setTimeout(function() {
    $("#lose-screen").addClass("hidden");
    setTimeout(function() {
      $("#lose-screen").removeClass("hidden");
      setTimeout(function() {
        $("#lose-screen").addClass("hidden");
        try {
          errOsc.stop();
        } catch(e) {}
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
  try {
    greenOsc.stop();
  } catch(e) {}
  try {
    redOsc.stop();
  } catch(e) {}
  try {
    yellowOsc.stop();
  } catch(e) {}
  try {
    blueOsc.stop();
  } catch(e) {}
}

function lightGreen() {
  $("#green-light").addClass("green-light-on");
  greenOsc = audio.createOscillator();
  greenOsc.type = "sine";
  greenOsc.frequency.value = 261.626;
  greenOsc.connect(audio.destination);
  greenOsc.start();
}

function lightRed() {
  $("#red-light").addClass("red-light-on");
  redOsc = audio.createOscillator();
  redOsc.type = "sine";
  redOsc.frequency.value = 293.665;
  redOsc.connect(audio.destination);
  redOsc.start();
}

function lightYellow() {
  $("#yellow-light").addClass("yellow-light-on");
  yellowOsc = audio.createOscillator();
  yellowOsc.type = "sine";
  yellowOsc.frequency.value = 329.628;
  yellowOsc.connect(audio.destination);
  yellowOsc.start();
}

function lightBlue() {
  $("#blue-light").addClass("blue-light-on");
  blueOsc = audio.createOscillator();
  blueOsc.type = "sine";
  blueOsc.frequency.value = 440;
  blueOsc.connect(audio.destination);
  blueOsc.start();
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
  $("#green-corner").on("mousedown touchstart", function() {
    if (whoseTurn !== "computer") {
      lightGreen();
    }
  });
  $("#red-corner").on("mousedown touchstart", function() {
    if (whoseTurn !== "computer") {
      lightRed();
    }
  });
  $("#yellow-corner").on("mousedown touchstart", function() {
    if (whoseTurn !== "computer") {
      lightYellow();
    }
  });
  $("#blue-corner").on("mousedown touchstart", function() {
    if (whoseTurn !== "computer") {
      lightBlue();
    }
  });
  $("body").on("mouseup touchend", function() {
    if (whoseTurn !== "computer"){
      turnLightsOff();
    }
  })
});
