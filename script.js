var todaysAnswer = getTodaysWord();
const guessedWords = [];
const colourPalette = {
  green: "#96ceb4",
  yellow: "#ffeead",
  grey: "#888888",
};
var keyColourMap = generatekeyColourMap();
var cellCounter = 0; // Keeps track of where the next letter goes in the grid

function submitAnswer(input) {
  if (validate(input)) {
    var resultColours = getResultColours(input, todaysAnswer);
    cellCounter += 1; // Go to firs cell in next row
    guessedWords.push(input);

    // Render coloured cells
    var currentRowNumber = guessedWords.length;
    var currentRowId = "row-" + currentRowNumber.toString();
    var currentRowCells = document.querySelectorAll(`#${currentRowId} .cell`);
    for (i = 0; i < currentRowCells.length; i += 1) {
      updateColour(currentRowCells[i], resultColours[i]);
    }

    // Render coloured keyboard buttons
    for (i = 0; i < input.length; i += 1) {
      var key = document.querySelector(`[data-key="${input[i]}"]`);
      updateColour(key, keyColourMap[input[i]]);
    }
  } else {
    alert(`${input} is not a valid word.`);
  }
  // return myOutput;
}

// Generate today's word
function getTodaysWord() {
  let startDate = new Date("09/01/2022");
  let today = new Date();
  let timePassed = today.getTime() - startDate.getTime();
  var offset = Math.ceil(timePassed / (1000 * 3600 * 24));
  var todaysWord = words[offset];
  return todaysWord;
}

function displayGuessedWord(letter) {
  const cells = document.querySelectorAll(".cell");
  var currentCell = cells[cellCounter];
  currentCell.innerHTML = letter;
  if (currentCell.id != 5) {
    cellCounter += 1;
  }
}

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

// Check if player's guess is in the word bank
function validate(guess) {
  let firstLetter = guess[0];
  if (indexedWords[firstLetter].includes(guess)) {
    console.log(`${guess} is a word.`);
    return true;
  } else {
    console.log(`${guess} is not a valid word.`);
    return false;
  }
}

// Generate an array for the colour at each position
function getResultColours(guess, answer) {
  var answerArray = getLettersArray(answer);

  // Starting state to be updated
  var resultColours = ["grey", "grey", "grey", "grey", "grey"];
  for (i = 0; i < guess.length; i += 1) {
    keyColourMap[guess[i]] = "grey";
  }

  // var greenLetters = [];

  // First round: check for correct/green letters
  for (i = 0; i < guess.length; i += 1) {
    if (guess[i] == answer[i]) {
      resultColours[i] = "green";
      // greenLetters.push(guess[i]);
      answerArray[i] = null;
      keyColourMap[guess[i]] = "green";
    }
  }
  console.log("After checking for green:");
  console.log(resultColours);
  console.log(answerArray);
  console.log(keyColourMap);

  // Second round: check for yellow letters
  for (i = 0; i < guess.length; i += 1) {
    if (resultColours[i] == "green") {
      // Skip if the letter is already green
    } else if (answerArray.includes(guess[i])) {
      resultColours[i] = "yellow";
      var index = answerArray.indexOf(guess[i]);
      answerArray.splice(index, 1, null);
      keyColourMap[guess[i]] = "yellow";
    }
  }
  console.log("After checking for yellow");
  console.log(resultColours);
  console.log(answerArray);
  console.log(keyColourMap);
  return resultColours;
}

// HELPER FUNCTIONS

// Convert letters in each row in the grid into a string
function getWord() {
  var word = "";
  var currentRowIndex = guessedWords.length;
  var currentRowId = "row-" + (currentRowIndex + 1).toString();
  var currentRowCells = document.querySelectorAll(`#${currentRowId} .cell`);
  for (i = 0; i < currentRowCells.length; i += 1) {
    word += currentRowCells[i].innerHTML;
  }
  return word;
}
// Breakdown any word into an array of letters
function getLettersArray(anyWord) {
  return anyWord.split("");
}

function countOccurence(value, array) {
  var occurence = array.filter((item) => item == value).length;
  return occurence;
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
  for (i = 0; i < alphabet.length; i += 1) {
    keyColourMap[alphabet[i]] = "";
  }
  return keyColourMap;
}
