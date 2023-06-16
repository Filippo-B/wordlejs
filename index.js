'use strict'
import { wordleLa } from './wordleLa.js'
import { wordleTa } from './wordleTa.js'
const root = document.getElementById('root');
const WORD = 'panic';
const ROWS = 6;
const COLS = 5;
let CURRENT_ROW = 0
let GAME_STATE = 'PLAY'
const wordTracker = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ''))
console.log(wordTracker)

let headerContainer = null
let wordleContainer = null
let wordleSection = null
let messageModalContainer = null

/* ============================================ */
/* ··········································· § ANIMATIONS ··· */
/* ======================================== */

/**
 * Animation of a box when a new letter is added
 */
const pressKeyFeedbackAnimation = [
  { transform: 'scale(1.1)' },
  { transform: 'scale(1)' },
]

const errorFeedbackAnimation = [
  { transform: 'translateX(-4px)' },
  { transform: 'translateX(+4px)' },
  { transform: 'translateX(-4px)' },
  { transform: 'translateX(+4px)' },
  { transform: 'translateX(-4px)' },
  { transform: 'translateX(+4px)' },
  { transform: 'translateX(0)' },
]

const scaleToZeroAnimation = [
  { transform: 'scaleY(100%)' },
  { transform: 'scaleY(0)' },
]

// TODO: there has tobe a reverse() method
const scaleBack = [
  { transform: 'scaleY(100%)' },
]

const fadeOutAFterDelay = [
  { opacity: 1 },
  { opacity: 0 }
]


/* ============================================ */
/* ··········································· § HEADER ··· */
/* ======================================== */

/**
 * Create the header.
 */
function createHeader() {
  const header = document.createElement('header')
  header.style.width = '100%'
  header.style.padding = '20px 0'
  header.style.borderBottom = `1px solid ${getColorFromCSSVar('--color-tone-3')}`
  header.style.textAlign = `center`
  header.style.marginBottom = '6rem'
  header.id = 'headerContainer'
  root.insertAdjacentElement('afterbegin', header)
  headerContainer = document.getElementById('headerContainer')

  /* =================================== § HEADER TITLE === */
  const title = document.createElement('h1')
  title.textContent = 'Wordle'
  title.style.fontFamily = '"Roboto Slab", serif'
  title.style.fontSize = '38px'
  title.style.fontWeight = '700'
  header.insertAdjacentElement('afterbegin', title)

}
createHeader()

/* =================================== § WORDLE CONTAINER === */
/**
 * Create the wordle section and container.
 */
function createWordleContainer() {
  const wordleSectionEl = document.createElement('section')
  wordleSectionEl.style.display = 'flex'
  wordleSectionEl.style.justifyContent = 'center'
  wordleSectionEl.style.width = '100%'
  wordleSectionEl.style.display = 'flex'
  wordleSectionEl.style.flexDirection = 'column'
  wordleSectionEl.style.alignItems = 'center'

  wordleSectionEl.id = 'wordleSection'
  headerContainer.insertAdjacentElement("afterend", wordleSectionEl)
  wordleSection = document.getElementById('wordleSection')

  const wordleContainerEl = document.createElement('div')
  wordleContainerEl.style.display = 'grid'
  wordleContainerEl.style.gridTemplateRows = 'repeat(6, 62px)'
  wordleContainerEl.style.gap = '5px'

  wordleContainerEl.id = 'wordleContainer'
  wordleSectionEl.insertAdjacentElement('afterbegin', wordleContainerEl)
  wordleContainer = document.getElementById('wordleContainer')
}
createWordleContainer()

/* =================================== § ROWS AND COLS === */
/**
 * Generate wordle grid.
 */
function generateGrid() {

  for (let i = 0; i < ROWS; i++) {
    const row = document.createElement('div')
    row.style.display = 'grid'
    row.style.gridTemplateColumns = 'repeat(5, 62px)'
    row.style.gap = '5px'
    row.setAttribute('data-row', i)
    wordleContainer.insertAdjacentElement('beforeend', row)

    for (let j = 0; j < COLS; j++) {
      const box = document.createElement('div')
      box.style.width = '100%'
      box.style.height = '100%'
      box.style.border = `2px solid ${getColorFromCSSVar('--color-absent')}`
      box.style.display = 'flex'
      box.style.justifyContent = 'center'
      box.style.alignItems = 'center'
      box.style.textTransform = 'uppercase'
      box.style.fontSize = '2rem'

      box.textContent = wordTracker[i][j]
      box.setAttribute('data-box', `${i},${j}`)
      row.insertAdjacentElement('beforeend', box)
    }
  }
  wordleSection.insertAdjacentElement('afterbegin', wordleContainer)
}
generateGrid()


/**
 * Adds a letter to the first empty box of the active row.
 */
function addLetter(e) {
  // const row = () => CURRENT_ROW
  // console.log(row())
  const firstEmptySpace = wordTracker[CURRENT_ROW].indexOf('')
  if (firstEmptySpace !== -1) {
    wordTracker[CURRENT_ROW][firstEmptySpace] = e.key
    console.log(`[data-box="${CURRENT_ROW},${firstEmptySpace}]`)
    const boxElement = document.querySelector(`[data-box="${CURRENT_ROW},${firstEmptySpace}"]`)
    boxElement.textContent = e.key.toUpperCase()
    boxElement.style.border = `2px solid ${getColorFromCSSVar('--color-tone-3')}`
    boxElement.animate(pressKeyFeedbackAnimation, 50)
  }
}

/**
 * Removes the last letter of the active row.
 */
function removeLetter(e) {
  const lastLetter = wordTracker[CURRENT_ROW].findLastIndex(l => l !== '')

  if (lastLetter !== -1) {
    wordTracker[CURRENT_ROW][lastLetter] = ''
    const boxElement = document.querySelector(`[data-box="${CURRENT_ROW},${lastLetter}"]`)
    boxElement.textContent = ''
    boxElement.style.border = `2px solid ${getColorFromCSSVar('--color-absent')}`
  }
}

const wordIs = {
  correct: 'correc',
  present: 'present',
  notPresent: 'notPresent',
  tooShort: 'tooShort'
}

/**
 * Check if the word is correct or not.
 * @param {string} word - The word to check.
 * @returns {string} Correct, present or notPresent
 */
function checkWord(word) {
  word = word.trim()
  if (typeof (word) !== 'string') throw Error('word must be a string.')

  if (word === WORD) return wordIs.correct
  if (wordleLa.has(word) || wordleTa.has(word)) return wordIs.present
  if (word.length < 5) return wordIs.tooShort
  else return wordIs.notPresent
}

/**
 * Checks a letter and output the appropriate color if it's present in WORD.
 * @param {string} letter - The letter to check.
 * @param {number} i - The index.
 * @returns {string} - The color.
 */
function colorFeedback(letter, i) {
  if (WORD[i] === letter) return getColorFromCSSVar('--color-correct')
  if (WORD.includes(letter)) return getColorFromCSSVar('--color-present')
  return getColorFromCSSVar('--color-absent')
}

/**
 * Change the background color of the boxes based on wherther a letter is correct / present / absent.
 * @param {string} wordStatus - Whether the word is correct, present or not present
 */
async function boxFeedback(wordStatus) {
  const currentRowEl = document.querySelector(`[data-row="${CURRENT_ROW}"`)
  const boxes = currentRowEl.querySelectorAll('div')
  const messagesCount = Array.from(messageModalContainer.querySelectorAll('.message')).length

  if (wordStatus === wordIs.notPresent) {
    currentRowEl.animate(errorFeedbackAnimation, 300)
    addMessage('Not in word list')
  } else if (wordStatus === wordIs.tooShort) {
    currentRowEl.animate(errorFeedbackAnimation, 300)
    if (messagesCount <= 10) {
      addMessage('Not enough words')
    }
  } else {

    /**
     * Animate the letters in sequence, giving each box the appropriate background color.
     * @param {number} i - The starting index. 0 is the default.
     */
    function animateLetters(i = 0) {
      const box = boxes[i]

      if (!box) return

      const currentLetter = box.textContent?.toLowerCase()
      const an = box.animate(scaleToZeroAnimation, { duration: 300, fill: 'forwards' })
      an.play()

      an.onfinish = () => {
        box.style.backgroundColor = colorFeedback(currentLetter, i)
        box.style.borderColor = colorFeedback(currentLetter, i)
        box.animate(scaleBack, { duration: 300, fill: 'forwards' })
        animateLetters(i + 1)
      }
    }

    animateLetters()
    CURRENT_ROW++
  }

  if (wordStatus === wordIs.correct) {
    GAME_STATE = 'END'
  }
}

/**
 * Creates the container for the messages.
 */
function createMessageModalContainer() {
  const modal = document.createElement('div')
  // modal.textContent = 'Modal text content'
  // modal.style.backgroundColor = 'lightblue'
  modal.style.position = 'absolute'
  modal.style.top = '70px'
  modal.style.width = '100%'
  modal.style.display = 'flex'
  modal.style.flexDirection = 'column'
  modal.style.gap = '1rem'

  modal.style.alignItems = 'center'

  modal.id = 'messageModalContainer'

  root.insertAdjacentElement('beforeend', modal)
  messageModalContainer = document.getElementById('messageModalContainer')
}

createMessageModalContainer()

/**
 * Add a new message to the modal container.
 * @param {string} message - The content of the message.
 */
let timeout = null
function addMessage(message) {
  if (timeout) clearTimeout(timeout)

  const modal = document.createElement('div')
  modal.textContent = message
  modal.classList.add('message')

  modal.style.backgroundColor = 'white'
  modal.style.color = getColorFromCSSVar('--black')
  modal.style.borderRadius = '5px'
  modal.style.fontSize = '14px'
  modal.style.fontWeight = 'bold'
  modal.style.padding = '0.8rem 0.7rem'

  messageModalContainer.insertAdjacentElement('afterBegin', modal)

  const messages = Array.from(messageModalContainer.querySelectorAll('.message'))

  if (messages.length > 8) messages[messages.length - 1].remove()

  timeout = setTimeout(() => removeModalsMessages(), 1000)
}


function removeModalsMessages() {
  const messagesEl = Array.from(messageModalContainer.querySelectorAll('.message'))
  let i = messagesEl.length - 1

  /**
   * Check if there is an element after the current one. If there is it means that another message has been added while the function was in execution, and it needs to stop on order to avoid messing up the animation.
   */
  function elementAfterCurrent() {
    return Array.from(messageModalContainer.querySelectorAll('.message'))[i + 1]
  }

  /**
   * Removes the message in sequence starting from the last one.
   * @param {number} i - The index of the last element.
   */
  function removeMessagesInSequence(i) {
    const message = messagesEl[i]

    if (i < 0) return
    if (elementAfterCurrent()) return

    const an = message.animate(fadeOutAFterDelay, { duration: 100, fill: 'forwards' })
    an.play()

    an.onfinish = () => {
      message.remove()
      removeMessagesInSequence(i - 1)
    }
  }
  removeMessagesInSequence(i)
}


/* ============================================ */
/* ··········································· § TYPING ··· */
/* ======================================== */
window.addEventListener('keydown', (e) => {
  // TODO: if i press a modifier nothing should happen
  console.log(e.key)
  if (GAME_STATE === 'PLAY') {
    if (isValidLetter(e.key)) {
      addLetter(e)
    } else if (e.key === 'Backspace') {
      removeLetter(e)
    } else if (e.key === 'Enter') {
      const currentWord = wordTracker[CURRENT_ROW].join('')
      boxFeedback(checkWord(currentWord))
    }
  }
})

/* ============================================ */
/* ··········································· § UTILS ··· */
/* ======================================== */
/**
 * Check if a string is a letter between a-z or A-Z and if the string consists of only one letter.
 * @param {string} letter - The string to check. It should have a length of 1.
 * @returns {boolean} True or false
 */
function isValidLetter(letter) {
  return /^[a-z]{1}$/i.test(letter) && letter.length === 1
}

/**
 * Get the color from a CSS variable.
 * @param {string} name The name of the CSS variable --something-something
 * @returns {string} The hex of the color.
 */
function getColorFromCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}