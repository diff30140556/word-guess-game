// 1. store DOM elements in a variable to reference/change in the functions
var startBtn = document.querySelector('.start-button');
var resetBtn = document.querySelector('.reset-button');
var blanksWord = document.querySelector('.word-blanks');
var wins = document.querySelector('.win');
var losses = document.querySelector('.lose');
var sec = document.querySelector('.timer-count');
var body = document.querySelector('body');

// 2. initialize variables with default state (i.e. wins/losses/timers/arrays, etc.)
var winTimes = 0;
var loseTimes = 0;
var timeLeft = 10;
var chosenWord = '';//the word picked up randomly
var splitWords = [];//split the random word
var blankLetters = [];//the invisible word for rendering and validation
// words' list
var words = ["variable","array", "modulus", "object", "function", "string", "boolean"];

// 3. create an `init` function to kick off the game on browser load
function init(){
    getLosses();
    getWins();
}

// 4. create functions for:
// - 4.1. `startGame` - when the start button is clicked

function startGame(){
    // if the list is empty/ means the player completed all of the questions
    if(words.length===0){
        return blanksWord.textContent = "No more words, plz reset"
    }
    // it will render 10s on the screen right away after click start button to play again. Disable the button while playing
    timeLeft = 10;
    sec.textContent = timeLeft;
    renderBlank();
    startTimer();
    startBtn.disabled = true;
    resetBtn.disabled = true;
}

// - 4.2. `winGame` - called when the win condition is met
function winGame(){
    clearInterval(setTimer);
    setWins();
}

// - 4.3. `loseGame` - called when timer reaches 0
function loseGame(){
    clearInterval(setTimer);
    setLosses();
}

// - 4.4. `startTimer` - starts and stops the timer and triggers winGame() and loseGame()

function startTimer(){
    setTimer = setInterval(function(){
        timeLeft --;
        sec.textContent = timeLeft;
        // game over when times out, the user didn't guess the word
        if(timeLeft===0){
            loseGame();
        }
    },1000)
} 

// - 4.5. `renderBlanks` (showing # of spaces of characters in the word)
function renderBlank(){
    let wordsLength = words.length;
    let randomNum = Math.floor(Math.random()*wordsLength);
    chosenWord = words[randomNum];
    // remove the chosenWord from the original list
    words.splice(randomNum,1);
    console.log(words);
    splitWords = chosenWord.split('');
    let splitWordsLength = splitWords.length;
    // creating the blank word
    for (let i=0; i<splitWordsLength; i++){
        blankLetters.push('_');
    }
    // render on the browser
    blanksWord.textContent = blankLetters.join(' ');
    console.log(chosenWord);
    console.log(splitWords);
    console.log(blankLetters);
}

// - 4.6. `setWins` - updates win count on screen and sets win count to client storage
function setWins(){
    winTimes++;
    localStorage.setItem('wins',winTimes);
    blanksWord.textContent = "Ya! You Win!!!"
    getWins();    
    chosenWord = '';
    blankLetters = [];
    startBtn.disabled = false;
    resetBtn.disabled = false;
}

// - 4.7. `setLosses` - updates lose count on screen and sets lose count to client storage
function setLosses(){   
    loseTimes++;
    localStorage.setItem('losses',loseTimes);
    blanksWord.textContent = "Oh no, you lose.."
    getLosses();
    chosenWord = '';
    blankLetters = [];  
    startBtn.disabled = false;
    resetBtn.disabled = false;
}

// - 4.8. `getWins` - used by init
function getWins(){
    winTimes = localStorage.getItem('wins');
    wins.textContent = winTimes||0;
}
// - 4.9. `getLosses` - used by init
function getLosses(){
    loseTimes = localStorage.getItem('losses');
    losses.textContent = loseTimes||0;
}


// - 4.10. `checkWin`
// if blankLetters equal chosenWord, the answer is correct
function checkWin(){
    if (blankLetters.join('')===chosenWord){
        winGame();
    }
}
// - 4.11. `checkLetters` - test if guessed letter is in word and renders it to the screen

function checkLetters(e){
    let key = e.key;
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';

    // if the input is not alphabet, return the function
    if (timeLeft === 0 || chosenWord === '' || !alphabet.includes(key)){
        return; 
    };
    // if the input equal the character, fill it in.
    for(let i=0; i < splitWords.length; i++){
        if (key === splitWords[i]){
            blankLetters[i]=key;
        }
        blanksWord.textContent = blankLetters.join(' ');
    }
    checkWin();
}

// 5. hook up event listeners for button clicks & keydown letter guesses
startBtn.addEventListener('click',startGame);
resetBtn.addEventListener('click',resetGame);
body.addEventListener('keydown',checkLetters)

// 6. call your `init` function to start the game!
init();

// 7. ***BONUS***: add the `resetGame` functionality
function resetGame(){
    localStorage.clear();
    getWins();
    getLosses();
    words = ["variable","array", "modulus", "object", "function", "string", "boolean"];
}
