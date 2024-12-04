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
import confetti from "https://esm.run/canvas-confetti@1"

// Some useful elements
const guessInput = document.getElementById('guess-input')
const guessInputForm = document.getElementById('guess-input-form')
const messageContainer = document.getElementsByClassName('message-container')[0]
const emojiCluesContainer = document.getElementsByClassName('emoji-clues-container')[0]

const successAlert = new Audio('assets/sparkle-ding.mp3')
const failAlert = new Audio('assets/fatal-error.mp3')
const emptyInputAlert = new Audio('assets/add-note-attention.mp3')
const goToNextAlert = new Audio('assets/deep-low-whoosh.mp3')
const completedAlert = new Audio('assets/christmas-sleigh-bell-alert.mp3')

let attempts
let randomFilmID
let rolledMovie

function rollAMovie() {
  goToNextAlert.play()
  attempts = 3
  randomFilmID = Math.floor(Math.random() * films.length)
  rolledMovie = films[randomFilmID]
  const ariaLabels = rolledMovie.ariaLabel.split(", ")
  const emojiClueElem = rolledMovie.emoji.map((emo, idx) => `
    <span title='${ariaLabels[idx]}' class='emoji'>${emo}</span>
  `).join('')
  emojiCluesContainer.innerHTML = emojiClueElem
  emojiCluesContainer.setAttribute('aria-label', rolledMovie.ariaLabel)
  messageContainer.textContent = `You have ${attempts} guesses remaining.`
}

rollAMovie()

function rollANewMovie() {
  emojiCluesContainer.innerHTML = emojiPlaceholder()
  guessInput.disabled = true
  document.querySelector('button[type=submit]').disabled = true
  document.querySelector('button[type=submit]').textContent = 'Rolling in new emoji clues...'
  setTimeout(() => {
    guessInput.disabled = false
    guessInput.focus()
    document.querySelector('button[type=submit]').disabled = false
    document.querySelector('button[type=submit]').textContent = 'Submit Guess'
    films.splice(randomFilmID, 1)
    if (films.length === 0) {
      completedAlert.play()
      guessInputForm.style.display = 'none'
      messageContainer.textContent = ''
      emojiCluesContainer.textContent = "That's all folks!"
    } else {
      rollAMovie()
    }
  }, 3000);
}

function checkForAMatch(inputStr, targetFilm) {
  const normalizedInput = preprocessText(inputStr)
  const normalizedFilm = preprocessText(targetFilm)
  return normalizedInput === normalizedFilm
}

function handleSubmission(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  for (const entry of formData.entries()) {
    if (entry[1].trim() === '') {
      emptyInputAlert.play()
      messageContainer.textContent = `You didn't type anything! You still have ${attempts} guesses remaining.`
    } else {
      const matchFound = checkForAMatch(entry[1], rolledMovie.title)
      if (matchFound) {
        messageContainer.textContent = "Correct!"
        successAlert.play()
        throwConfetti()
        rollANewMovie()
      }
      else {
        --attempts
        failAlert.play()
        messageContainer.textContent = attempts == 0 ? `The film was '${rolledMovie.title}'!` : `Incorrect! You have ${attempts} guesses remaining.`
      }
    }

    attempts === 0 && rollANewMovie()

    e.target.reset() //this must be the last statement
  }
}

guessInputForm.addEventListener('submit', handleSubmission)

// Function to throw confetti when the guess is correct
function throwConfetti() {
  confetti({
    particleCount: 100,
    zIndex: 1,
    spread: 100,
    ticks: 175,
  })
}


/* STRETCH GOALS */

const stopWords = [
  'a', 'an', 'the', 'in', 'on', 'at', 'by', 'with', 'and', 'but', 'or', 'for', 'nor', 'so', 'yet', 'to', 'from'
];

function preprocessText(text) {
  // Convert to lowercase
  let processedText = text.trim().replace(/\s{2,}/gm, " ").toLowerCase();
  // Split text into words
  let words = processedText.split(/\s+/);

  // Remove stop words
  words = words.filter(word => !stopWords.includes(word));

  // Join the words back together
  return words.join(' ');
}

// Function to add placeholders for emojis during transitions
function emojiPlaceholder() {
  const elem = rolledMovie.emoji.map(el => `
    <span class='emoji-placeholder'>${el}</span>
  `).join('')
  return elem
}
