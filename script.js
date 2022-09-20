var todaysAnswer = getTodaysWord();
var pastOutput = ""; //// For the base render will delete later
const guessedWords = []; //// Write a function later to add past guesses
var cellCounter = 0; // Keeps track of where the next letter goes in the grid

function submitAnswer(input) {
  if (validate(input)) {
    var resultArray = getResultArray(input, todaysAnswer);
    //// Display output for base render
    var myOutput = "";
    for (i = 0; i < input.length; i += 1) {
      myOutput += `${input[i]} is ${resultArray[i]}<br>`;
    }
    pastOutput += myOutput + "<br>";
    console.log(myOutput);
    guessedWords.push(input);
  } else {
    //// Display some kind of message e.g. "your guess is not a valid word"
  }
  // return myOutput;
}

// Generate today's word
function getTodaysWord() {
  let startDate = new Date("09/19/2022");
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
  cellCounter += 1;
}

function removeLastLetter() {
  const cells = document.querySelectorAll(".cell");
  if (cellCounter < 1) {
  } else {
    var lastCell = cells[cellCounter - 1];
    lastCell.innerHTML = "";
    cellCounter -= 1;
  }
}

// Convert letters in each row in the grid into a string
function getWord() {
  var word = "";
  var currentRowIndex = guessedWords.length;
  var currentRowId = "row-" + (currentRowIndex + 1).toString();
  var currentRowCells = document.querySelectorAll(`#${currentRowId} .cell`);
  for (i = 0; i < currentRowCells.length; i += 1) {
    word += currentRowCells[i].innerHTML;
  }
  console.log(word);
  return word;
}

// Check if player's guess is in the word bank
function validate(guess) {
  let firstLetter = guess[0];
  // console.log(`first letter ${firstLetter}`);
  // console.log(`${indexedWords[firstLetter]}`);
  if (indexedWords[firstLetter].includes(guess)) {
    console.log(`${guess} is a word.`);
    return true;
  } else {
    console.log(`${guess} is not a valid word.`);
    return false;
  }
}

// Breakdown any word into an array of letters
function getLettersArray(anyWord) {
  return anyWord.split("");
}

// Generate an array for the colour at each position
function getResultArray(guess, answer) {
  var resultArray = [];
  // Check for incorrect letters; everything else is yellow
  for (i = 0; i < guess.length; i += 1) {
    if (!answer.includes(guess[i])) {
      resultArray.push("grey");
    } else {
      resultArray.push("yellow");
    }
  }

  var greenLetters = [];
  for (i = 0; i < guess.length; i += 1) {
    if (resultArray[i] == "yellow") {
      // Update yellow to green if the letter is in the correct location
      if (guess[i] == answer[i]) {
        resultArray[i] = "green";
        greenLetters.push(guess[i]);
      }
      // Update yellow to grey, if the target letter is alr green elsewhere, and the letter does not appear elsewhere in the word
      // E.g. the answer is "THEIR" and the guess is "THERE" -> the second "E" should be grey, not yellow, as the answer only has one "E"
      // The logic: if this letter is in the answer more times than it was correctly guessed, then it should be yellow; otherwise, it should be grey
      else if (
        countOccurence(guess[i], greenLetters) >=
        countOccurence(guess[i], getLettersArray(answer))
      ) {
        resultArray[i] = "gray";
      }
    }
  }
  console.log(resultArray);
  return resultArray;
}

function countOccurence(value, array) {
  var occurence = array.filter((item) => item == value).length;
  return occurence;
}

// //// Breakdown any word into a hash map (not in use)
// function getLettersObject(anyWord) {
//   let wordMap = {};
//   for (i = 0; i < anyWord.length; i += 1) {
//     wordMap[i.toString()] = anyWord[i];
//   }
//   console.log(wordMap);
//   return wordMap;
// }

// // Generate a hash map for the colour at each position (not in use)
// function getResultMap(guess, answer) {
//   var resultMap = {};
//   // Check for incorrect letters; everything else is yellow
//   for (i = 0; i < guess.length; i += 1) {
//     if (!answer.includes(guess[i])) {
//       resultMap[i.toString()] = "grey";
//     } else {
//       resultMap[i.toString()] = "yellow";
//     }
//   }

//   for (entry in resultMap) {
//     if (resultMap[entry] == "yellow") {
//       // Update yellow to green if the letter is in the correct location
//       if (guess[parseInt(entry)] == answer[parseInt(entry)]) {
//         resultMap[entry] = "green";
//       }
//       // Update yellow to grey, if the target letter is alr green elsewhere, and the letter does not appear elsewhere in the word
//       // E.g. answer is "THEIR" and guess is "THERE" -> second "E" should be grey, not yellow
//     }
//   }
//   console.log(resultMap);
//   return resultMap;
// }
