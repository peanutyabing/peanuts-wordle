activateKeyboard();
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
    var currentRowId = "row-" + currentRowNumber.toString();
    var currentRowCells = document.querySelectorAll(`#${currentRowId} .cell`);
    for (let i = 0; i < currentRowCells.length; i += 1) {
      updateColour(currentRowCells[i], resultColours[i]);
    }

    // Render coloured keyboard buttons
    for (let i = 0; i < input.length; i += 1) {
      var key = document.querySelector(`[data-key="${input[i]}"]`);
      updateColour(key, keyColourMap[input[i]]);
    }

    // Game outcome alert messages
    if (!resultColours.includes("yellow") && !resultColours.includes("grey")) {
      setTimeout(() => {
        alert(
          `Congrats! "${input}" is the correct word. Number of attempts: ${guessedWords.length}.`
        );
      }, 500);
      if (!unlimitedMode) {
        disableKeyboard();
      }
    } else if (guessedWords.length >= 6) {
      setTimeout(() => {
        alert(`You ran out of tries! The answer is "${correctAnswer}".`);
      }, 500);
      if (!unlimitedMode) {
        disableKeyboard();
      }
    }
  } else {
    setTimeout(() => {
      alert(`${input} is not in the word list. Try something else!`);
    }, 500);
  }
}

// Generate today's word
function getTodaysWord() {
  let startDate = new Date("09/10/2022");
  let today = new Date();
  let timePassed = today.getTime() - startDate.getTime();
  var offset = Math.ceil(timePassed / (1000 * 3600 * 24));
  var todaysWord = words[offset];
  return todaysWord;
}

// Generate a random word for unlimted mode
function getRandomWord() {
  var randomIndex = Math.floor(Math.random() * words.length);
  var randomWord = words[randomIndex];
  return randomWord;
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
function getResultColours(guess, correctAnswer) {
  var answerArray = getLettersArray(correctAnswer);

  // Starting state to be updated
  var resultColours = Array(5).fill("grey");
  for (let i = 0; i < guess.length; i += 1) {
    keyColourMap[guess[i]] = "grey";
  }

  // First round: check for correct/green letters
  for (let i = 0; i < guess.length; i += 1) {
    if (guess[i] == correctAnswer[i]) {
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
  for (let i = 0; i < currentRowCells.length; i += 1) {
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
  for (let i = 0; i < alphabet.length; i += 1) {
    keyColourMap[alphabet[i]] = "";
  }
  return keyColourMap;
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
  } // Disable on-screen keyboard after game ends
  document.onkeyup = function () {}; // Disable physical keyboard after game ends
}

function activateKeyboard() {
  // Enable on-screen keyboard actions: key in letters, delete, return
  const keys = document.querySelectorAll("#key");
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].onclick = (event) => {
      const letter = event.target.getAttribute("data-key");
      // console.log(letter);
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
