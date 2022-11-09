// STARTING STATE
let gameState = "playing";
let unlimitedMode = false;
var randomAnswer = getRandomWord();
var todaysFixedAnswer = getTodaysWord();
var correctAnswer = "";
var resultToShare = "";
const guessedWords = [];
const roundResultColours = [];
const colourPalette = {
  green: "#96ceb4",
  yellow: "#ffeead",
  grey: "#888888",
};
const colourSymbols = {
  green: "🟩",
  yellow: "🟨",
  grey: "⬛",
};
var keyColourMap = generatekeyColourMap();
var cellCounter = 0; // Keeps track of where the next letter goes in the grid

// GAME LOGIC
function displayResults(guess) {
  correctAnswer = getCorrectAnswer();

  if (validate(guess)) {
    var resultColours = getResultColours(guess, correctAnswer);
    cellCounter += 1; // Go to firs cell in next row
    roundResultColours.push(resultColours);
    guessedWords.push(guess);

    // Save this guess
    var currentRowNumber = guessedWords.length;
    saveGuess(guess, currentRowNumber);

    // Render coloured cells
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
    for (let i = 0; i < guess.length; i += 1) {
      var key = document.querySelector(`[data-key="${guess[i]}"]`);
      updateColour(key, keyColourMap[guess[i]]);
    }
  } else {
    showToast("Please enter a valid 5-letter word.");
  }
}

function tallyResults(guess) {
  var resultColours = getResultColours(guess, correctAnswer);
  if (!resultColours.includes("yellow") && !resultColours.includes("grey")) {
    var resultCookies = [`${guessedWords.length}`, "Played", "Won"];
    for (i = 0; i < resultCookies.length; i += 1) {
      var cookieValue = getCookie(resultCookies[i]);
      if (cookieValue.length == 0) {
        cookieValue = "1";
      } else {
        cookieValue = (parseInt(cookieValue) + 1).toString();
      }
      setCookie(resultCookies[i], cookieValue, getExpiryDate(365));
    }
    gameState = "over";
    saveGameState(gameState);
    generateResultToShare();
    setTimeout(() => {
      updateScores();
    }, 1000);
    highlightLastTry();
  } else if (guessedWords.length >= 6) {
    var cookieValue = getCookie("Played");
    if (cookieValue.length == 0) {
      cookieValue = "1";
    } else {
      cookieValue = (parseInt(cookieValue) + 1).toString();
    }
    setCookie("Played", cookieValue, getExpiryDate(365));
    gameState = "over";
    saveGameState(gameState);
    generateResultToShare();
    showToast(`You ran out of tries! The answer is "${correctAnswer}".`);
    setTimeout(() => {
      updateScores();
    }, 2000);
  }
}

// HELPER FUNCTIONS

// Check if player's guess is in the word bank
function validate(guess) {
  let firstLetter = guess[0];
  if (guess == "") {
    return false;
  } else if (indexedWords[firstLetter].includes(guess)) {
    return true;
  } else {
    return false;
  }
}

// Generate today's answer word
function getTodaysWord() {
  let startDate = new Date("09/10/2022");
  let today = new Date();
  let timePassed = today.getTime() - startDate.getTime();
  var offset = Math.ceil(timePassed / (1000 * 3600 * 24));
  var todaysWord = words[offset % words.length];
  return todaysWord;
}

// Generate a random answer word for unlimted mode
function getRandomWord() {
  var randomIndex = Math.floor(Math.random() * words.length);
  var randomWord = words[randomIndex];
  return randomWord;
}

function getCorrectAnswer() {
  if (unlimitedMode) {
    correctAnswer = randomAnswer;
  } else {
    correctAnswer = todaysFixedAnswer;
  }
  return correctAnswer;
}

// When user types...
function displayLetter(letter) {
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

// Generate an array of colours to display for the result
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

function displayTodaysGuesses() {
  var lastSavedState = getCookie("game-state");
  if (lastSavedState == "over") {
    gameState = "over";
  }
  var todaysGuesses = [];
  for (i = 0; i < 6; i += 1) {
    var guess = getCookie(`todays-guess-${i + 1}`);
    if (guess.length > 0) {
      todaysGuesses.push(guess);
      for (j = 0; j < 5; j += 1) {
        displayLetter(guess[j]);
      }
      displayResults(todaysGuesses[i]);
    }
  }
}

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = `${dd}/${mm}/${yyyy}`;
  return today;
}

function generateResultToShare() {
  if (!unlimitedMode) {
    resultToShare = `W∞rdle ${getTodaysDate()} ${
      roundResultColours.length
    }/6 \n`;
  } else {
    resultToShare = `W∞rdle ∞ ${roundResultColours.length}/6 \n`;
  }
  for (i = 0; i < roundResultColours.length; i += 1) {
    var rowColours = roundResultColours[i];
    for (j = 0; j < rowColours.length; j += 1) {
      resultToShare += colourSymbols[rowColours[j]];
    }
    resultToShare += "\n";
  }
}

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// COOKIES

function setCookie(cName, cValue, cExpiry) {
  document.cookie = `${cName}=${cValue}; expires=${cExpiry}; path=/`;
}

function getExpiryDate(daysFromToday) {
  const d = new Date(); // date and time right now
  d.setTime(d.getTime() + daysFromToday * 24 * 60 * 60 * 1000);
  let expiry = d.toUTCString();
  return expiry;
}

function getCookie(cName) {
  let name = cName + "=";
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

function saveGuess(guess, rowNumber) {
  if (!unlimitedMode) {
    // Today's guesses expire at 0000hrs the next day
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.toUTCString();

    setCookie(`todays-guess-${rowNumber}`, guess, tomorrow);
  }
}

function saveGameState(gameState) {
  if (!unlimitedMode) {
    // Today's game state expires together with saves guesses at 0000hrs the next day
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.toUTCString();

    setCookie("game-state", gameState, tomorrow);
  }
}
