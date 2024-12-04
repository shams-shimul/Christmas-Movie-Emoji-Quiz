/*
You are going to build an app that challenges players to identify a Christmas Movie from some emoji 🍿 🎅 🎬. The players will have 3 guesses per movie.

For example, the emoji 🌇 💣 👮 ✈️ ️🔫  represent the film “Die Hard”, which everyone knows is the best Christmas movie of all time.

In data.js you have an array of Christmas movies with emoji and text for aria labels.

Your task is to build an app that meets these criteria:

- The app should present the player with a set of emoji selected at random from the array in data.js. 

- The player will input their guess.

- If the player guesses correctly, the app should display a message saying "Correct!". Then, after a pause of 3 seconds, it should randomly select the next set of emoji clues and display them to the player.

- If the player’s guess is incorrect, the app should display a message saying “Incorrect! You have 2 more guesses remaining.”

- If the player fails to guess correctly on the next two attempts, the app should display a message saying, `The film was <Film Name Here>!`. After a pause of 3 seconds, it should randomly select a new set of emoji clues and display them to the player.

- When all films in the array have been used, the player should see a message saying "That's all folks!".

- Each film should only be used once. There should be no repetition. 


Stretch Goals

- Use AI to decide if an answer is correct or incorrect. For example if the correct answer is "The Polar Express" but the player inputs "Polar Express" a straight comparison of the two strings will find that the player's answer was incorrect. AI could assess if there is sufficient similarity between the strings to judge it as correct. 

- Improve the UX by disabling the form/button when the game is over and during the pause between questions.
*/

import { films } from '/data.js'

// Some useful elements
const guessInput = document.getElementById('guess-input')
const messageContainer = document.getElementsByClassName('message-container')[0]
const emojiCluesContainer = document.getElementsByClassName('emoji-clues-container')[0]

let attempts
let randomFilmID
let rolledFilm

function rollAMovie() {
  attempts = 3
  randomFilmID = Math.floor(Math.random() * films.length)
  rolledFilm = films[randomFilmID]
  emojiCluesContainer.textContent = rolledFilm.emoji.join(' ')
  messageContainer.textContent = `You have ${attempts} guesses remaining.`
}

rollAMovie()

function checkForAMatch(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  for (const entry of formData.entries()) {
    const input = entry[1].trim().replace(/\s{2,}/gm, " ").toLowerCase()
    if (input === '') {
      messageContainer.textContent = `You didn't type anything! You still have ${attempts} guesses remaining.`
    } else if (input === rolledFilm.title.toLowerCase()) {
      messageContainer.textContent = "Correct!"
      rollANewMovie()
    } else {
      --attempts
      messageContainer.textContent = attempts == 0 ? `The film was '${rolledFilm.title}'!` : `Incorrect! You have ${attempts} guesses remaining.`
    }
  }

  attempts === 0 && rollANewMovie()

  e.target.reset() //this must be the last statement
}

function rollANewMovie() {

  setTimeout(() => {

    films.splice(randomFilmID, 1)
    if (films.length === 0) {
      guessInput.style.display = 'none'
      messageContainer.textContent = ''
      emojiCluesContainer.textContent = "That's all folks!"
    } else {
      rollAMovie()
    }
  }, 3000);
}

guessInput.addEventListener('submit', checkForAMatch)