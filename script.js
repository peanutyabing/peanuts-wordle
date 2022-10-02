const cookieNames = ["Played", "Won", "1", "2", "3", "4", "5", "6"];

// STARTING STATE
var correctAnswer = "";
var randomAnswer = getRandomWord();
var todaysFixedAnswer = getTodaysWord();
const guessedWords = [];
const colourPalette = {
  green: "#96ceb4",
  yellow: "#ffeead",
  grey: "#888888",
};
var keyColourMap = generatekeyColourMap();
var cellCounter = 0; // Keeps track of where the next letter goes in the grid
let unlimitedMode = false;

// GAME LOGIC
function submitAnswer(input) {
  if (unlimitedMode) {
    correctAnswer = randomAnswer;
  } else {
    correctAnswer = todaysFixedAnswer;
  }

  if (validate(input)) {
    var resultColours = getResultColours(input, correctAnswer);
    cellCounter += 1; // Go to firs cell in next row
    guessedWords.push(input);

    // Render coloured cells
    var currentRowNumber = guessedWords.length;
    var currentRowId = "#row-" + currentRowNumber.toString();
    var currentRowCells = document.querySelectorAll(`${currentRowId} .cell`);
    var interval = 100;
    for (let i = 0; i < currentRowCells.length; i += 1) {
      setTimeout(() => {
        const cellColour = colourPalette[resultColours[i]];
        currentRowCells[i].classList.add(
          "animate__animated",
          "animate__flipInX"
        );
        currentRowCells[i].style = `background-color:${cellColour}`;
      }, interval * i);
    }

    // Render coloured keyboard buttons
    for (let i = 0; i < input.length; i += 1) {
      var key = document.querySelector(`[data-key="${input[i]}"]`);
      updateColour(key, keyColourMap[input[i]]);
    }

    // Tally game outcome
    if (!resultColours.includes("yellow") && !resultColours.includes("grey")) {
      var cookiesToUpdate = [`${guessedWords.length}`, "Played", "Won"];
      for (i = 0; i < cookiesToUpdate.length; i += 1) {
        var value = getCookie(cookiesToUpdate[i]);
        if (value.length == 0) {
          value = "1";
        } else {
          value = (parseInt(value) + 1).toString();
        }
        setCookie(cookiesToUpdate[i], value, 365);
      }
      disableKeyboard();
      setTimeout(() => {
        alert(
          `Congrats! "${input}" is the correct word. Number of attempts: ${guessedWords.length}.`
        );
      }, 1000);
      setTimeout(() => {
        updateScores();
      }, 1000);
      highlightLastTry();
    } else if (guessedWords.length >= 6) {
      var value = getCookie("Played");
      if (value.length == 0) {
        value = "1";
      } else {
        value = (parseInt(value) + 1).toString();
      }
      setCookie("Played", value, 365);
      setTimeout(() => {
        alert(`You ran out of tries! The answer is "${correctAnswer}".`);
      }, 1000);
      setTimeout(() => {
        updateScores();
      }, 1000);
      if (!unlimitedMode) {
        disableKeyboard();
      }
    }
  } else {
    setTimeout(() => {
      alert(`Please enter a valid 5-letter word.`);
    }, 500);
  }
}

// HELPER FUNCTIONS

// Check if player's guess is in the word bank
function validate(guess) {
  let firstLetter = guess[0];
  if (guess == "") {
    return false;
  } else if (indexedWords[firstLetter].includes(guess)) {
    // console.log(`${guess} is a word.`);
    return true;
  } else {
    // console.log(`${guess} is not a valid word.`);
    return false;
  }
}

// Generate today's word
function getTodaysWord() {
  let startDate = new Date("09/10/2022");
  let today = new Date();
  let timePassed = today.getTime() - startDate.getTime();
  var offset = Math.ceil(timePassed / (1000 * 3600 * 24));
  var todaysWord = words[offset % words.length];
  return todaysWord;
}

// Generate a random word for unlimted mode
function getRandomWord() {
  var randomIndex = Math.floor(Math.random() * words.length);
  var randomWord = words[randomIndex];
  return randomWord;
}

// When user types...
function displayGuessedWord(letter) {
  const cells = document.querySelectorAll(".cell");
  var currentCell = cells[cellCounter];
  currentCell.innerHTML = letter;
  animateElementExpand(currentCell);
  if (currentCell.id != 5) {
    cellCounter += 1;
  }
}

// When user presses backspace...
function removeLastLetter() {
  const cells = document.querySelectorAll(".cell");
  var currentCell = cells[cellCounter];
  // Cannot delete into the last row
  if (currentCell.id == 1 && currentCell.innerHTML == "") {
  }
  // Exception of delete logic at the last cell of each row
  else if (currentCell.id == 5 && currentCell.innerHTML != "") {
    currentCell.innerHTML = "";
  } else if (
    (currentCell.id == 5 && currentCell.innerHTML == "") ||
    currentCell.id != 5
  ) {
    var lastCell = cells[cellCounter - 1];
    lastCell.innerHTML = "";
    cellCounter -= 1;
  }
}

// Generate an array for the colour at each position
function getResultColours(guess, correctAnswer) {
  var answerArray = getLettersArray(correctAnswer);

  // Default colour is grey, to be updated
  var resultColours = Array(5).fill("grey");
  for (let i = 0; i < guess.length; i += 1) {
    keyColourMap[guess[i]] = "grey";
  }

  // First round: check for correct/green letters
  for (let i = 0; i < guess.length; i += 1) {
    if (guess[i] == correctAnswer[i]) {
      resultColours[i] = "green";
      answerArray[i] = null;
      keyColourMap[guess[i]] = "green";
    }
  }

  // Second round: check for yellow letters
  for (let i = 0; i < guess.length; i += 1) {
    if (resultColours[i] == "green") {
      // Skip if the letter is already green
    } else if (answerArray.includes(guess[i])) {
      resultColours[i] = "yellow";
      var index = answerArray.indexOf(guess[i]);
      answerArray.splice(index, 1, null);
      keyColourMap[guess[i]] = "yellow";
    }
  }
  return resultColours;
}

// Retrieve the word from each row as a string
function getWord() {
  var word = "";
  var currentRowIndex = guessedWords.length;
  var currentRowId = "#row-" + (currentRowIndex + 1).toString();
  var currentRowCells = document.querySelectorAll(`${currentRowId} .cell`);
  for (let i = 0; i < currentRowCells.length; i += 1) {
    word += currentRowCells[i].innerHTML;
  }
  return word;
}

// Breakdown any string into an array of individual letters
function getLettersArray(anyWord) {
  return anyWord.split("");
}

function updateColour(element, colour) {
  element.style.backgroundColor = colourPalette[colour];
}

function generatekeyColourMap() {
  const keyColourMap = {};
  const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  for (let i = 0; i < alphabet.length; i += 1) {
    keyColourMap[alphabet[i]] = "";
  }
  return keyColourMap;
}

function updateScores() {
  var playedField = document.querySelector("#played");
  var wonField = document.querySelector("#won");
  var winRateField = document.querySelector("#win-rate");
  var numberOfTriesFields = document.querySelectorAll(".tries");

  playedField.innerHTML = `Played<br>${getCookie("Played")}`;
  wonField.innerHTML = `Won<br>${getCookie("Won")}`;
  winRateField.innerHTML = `Win rate<br>${parseInt(
    (getCookie("Won") / getCookie("Played")) * 100
  )}%`;

  var triesStats = [];
  for (i = 0; i < numberOfTriesFields.length; i += 1) {
    triesStats.push(getCookie(i + 1));
  }

  var highestStat = Math.max(...triesStats);
  for (i = 0; i < numberOfTriesFields.length; i += 1) {
    numberOfTriesFields[i].style.width = `${
      (triesStats[i] / highestStat) * 94
    }%`;
    if (triesStats[i] != 0) {
      numberOfTriesFields[i].innerHTML = `${triesStats[i]}`;
    }
  }
  // Make the scoreboard modal appear (hidden by default)
  modalScores.style.display = "block";
}

function highlightLastTry() {
  var numberOfTriesFields = document.querySelectorAll(".tries");

  for (i = 0; i < numberOfTriesFields.length; i += 1) {
    if (i + 1 == guessedWords.length) {
      numberOfTriesFields[i].style.backgroundColor = "#428365";
      numberOfTriesFields[i].style.color = "#ffffff";
    }
  }
}

function removeScoreboardInlineStyle() {
  var numberOfTriesFields = document.querySelectorAll(".tries");
  for (i = 0; i < numberOfTriesFields.length; i += 1) {
    numberOfTriesFields[i].removeAttribute("style");
  }
}

function resetGrid() {
  const cells = document.querySelectorAll(".cell");
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].innerHTML = "";
    cells[i].style.backgroundColor = "";
  }
}

function resetKeyboard() {
  const keys = document.querySelectorAll("#key");
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].style.backgroundColor = "";
  }
}

function disableKeyboard() {
  var keys = document.querySelectorAll("#key");
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].onclick = () => {};
  } // Disable on-screen keyboard after round ends
  document.onkeyup = function () {}; // Disable physical keyboard after round ends
}

function activateKeyboard() {
  // Enable on-screen keyboard actions: key in letters, delete, return
  const keys = document.querySelectorAll("#key");
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].onclick = (event) => {
      const letter = event.target.getAttribute("data-key");
      if (letter == "delete") {
        removeLastLetter();
      } else if (letter == "return") {
        var currentGuess = getWord();
        submitAnswer(currentGuess);
      } else {
        displayGuessedWord(letter);
      }
    };

    // Computer keyboard actions with input validation
    document.onkeyup = (event) => {
      const keyPressed = event.key;
      if (keyPressed == "Backspace") {
        removeLastLetter();
      } else if (keyPressed == "Enter") {
        var currentGuess = getWord();
        submitAnswer(currentGuess);
      } else if (keyPressed.length == 1 && keyPressed.match(/[a-z]/i)) {
        displayGuessedWord(keyPressed.toLowerCase());
      }
    };
  }
}

function animateElementExpand(element) {
  const cellExpand = [{ transform: "scale(0.9)" }, { transform: "scale(1.1)" }];
  const expandTiming = {
    duration: 100,
    iterations: 1,
  };
  element.animate(cellExpand, expandTiming);
}

function removeFlipCellsAnimation() {
  var cells = document.querySelectorAll(".cell");
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].classList.remove("animate__animated", "animate__flipInX");
  }
}

// COOKIES

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
