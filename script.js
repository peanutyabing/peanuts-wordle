var todaysAnswer = getTodaysWord();
var pastOutput = "";

var main = function (input) {
  var resultMap = getResultMap(input, todaysAnswer);
  var myOutput = "";
  for (i = 0; i < input.length; i += 1) {
    myOutput += `${input[i]} is ${resultMap[i.toString()]}<br>`;
  }
  pastOutput += myOutput + "<br>";
  return myOutput;
};

// Generate today's word
function getTodaysWord() {
  let startDate = new Date("09/19/2022");
  let today = new Date();
  let timePassed = today.getTime() - startDate.getTime();
  var offset = Math.ceil(timePassed / (1000 * 3600 * 24));
  var todaysWord = words[offset];
  return todaysWord;
}

// Check if player's guess is in the word bank
function validate(guess) {
  let firstLetter = guess[0];
  console.log(`first letter ${firstLetter}`);
  console.log(`${indexedWords[firstLetter]}`);
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

// Breakdown any word into a hash map
function getLettersObject(anyWord) {
  let wordMap = {};
  for (i = 0; i < anyWord.length; i += 1) {
    wordMap[i.toString()] = anyWord[i];
  }
  console.log(wordMap);
  return wordMap;
}

// Generate a hash map for the colour at each position
function getResultMap(guess, answer) {
  var resultMap = {};
  // Check for incorrect letters; everything else is yellow
  for (i = 0; i < guess.length; i += 1) {
    if (!answer.includes(guess[i])) {
      resultMap[i.toString()] = "grey";
    } else {
      resultMap[i.toString()] = "yellow";
    }
  }
  // Update yellow to green if the letter is in the correct location
  for (entry in resultMap) {
    if (resultMap[entry] == "yellow") {
      if (answer[parseInt(entry)] == guess[parseInt(entry)]) {
        resultMap[entry] = "green";
      }
    }
  }
  console.log(resultMap);
  return resultMap;
}

//You have to guess the Wordle in six goes or less
