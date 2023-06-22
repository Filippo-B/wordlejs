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
let keyboardContainer = null

const wordIs = {
  correct: 'correct',
  present: 'present',
  notPresent: 'notPresent',
  tooShort: 'tooShort'
}
const backSpaceSVG = `<svg style="width:1.5rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
</svg>`
/* ============================================ */
/* ··········································· § ROOT STYLES ··· */
/* ======================================== */

root.style.display = 'flex'
root.style.flexDirection = 'column'
root.style.minHeight = '100vh'

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

// TODO: there has to be a reverse() method
const scaleTo100 = [
  { transform: 'scaleY(100%)' },
]

const fadeOut = [
  { opacity: 1 },
  { opacity: 0 }
]

const successAnimation = [
  { transform: 'translateY(0)' },
  { transform: 'translateY(-30px)' },
  { transform: 'translateY(0)' }
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
  wordleSectionEl.style.flexGrow = 1

  wordleSectionEl.id = 'wordleSection'
  headerContainer.insertAdjacentElement("afterend", wordleSectionEl)
  wordleSection = document.getElementById('wordleSection')

  const wordleContainerEl = document.createElement('div')
  wordleContainerEl.style.display = 'grid'
  wordleContainerEl.style.gridTemplateRows = 'repeat(6, 62px)'
  wordleContainerEl.style.gap = '5px'
  wordleContainerEl.style.marginBottom = 'auto'

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

/* ============================================ */
/* ··········································· § Keyboard ··· */
/* ======================================== */
/**
 * This object contains all the letters that goes in the keyboard and their status (present, not-present, etc).
 */
const keys = {
  'q': '', 'w': '', 'e': '', 'r': '', 't': '', 'y': '', 'u': '', 'i': '', 'o': '', 'p': '',
  ' ': '', 'a': '', 's': '', 'd': '', 'f': '', 'g': '', 'h': '', 'j': '', 'k': '', 'l': '', ' ': '',
  'enter': '', 'z': '', 'x': '', 'c': '', 'v': '', 'b': '', 'n': '', 'm': '', 'back': ''
}

/**
 * Returns the appropriate css color based on the current letter status
 * @param {String} letterStatus - Whether the word, is present, not present or correct.
 * @return - A css color.
 */
function keyboardKeyBackground(letterStatus) {
  if (letterStatus === wordIs.present) return getColorFromCSSVar('--color-present')
  if (letterStatus === wordIs.notPresent) return getColorFromCSSVar('--color-absent')
  if (letterStatus === wordIs.correct) return getColorFromCSSVar('--color-correct')
  return getColorFromCSSVar('--key-bg')
}

/**
 * Generates the keyboard using the right colors.
 * @param {object} keys - The object containing all the keys and their status.
 */
function generateKeyboard(keys) {
  const keysArr = Object.keys(keys)
  if (keyboardContainer) {
    keyboardContainer.innerHTML = ''
  } else {
    keyboardContainer = document.createElement('section')
  }
  keyboardContainer.id = 'keyboardContainer'
  keyboardContainer.style.display = 'grid'
  keyboardContainer.style.gridTemplateColumns = 'repeat(20, 1fr)'
  keyboardContainer.style.gridTemplateRows = 'repeat(3, 1fr)'
  keyboardContainer.style.gap = '0.4rem'
  keyboardContainer.style.paddingBottom = '0.5rem'

  keyboardContainer.style.width = '100%'
  keyboardContainer.style.maxWidth = '484px'
  keyboardContainer.style.height = '200px'

  for (let letter of keysArr) {
    const key = document.createElement('div')
    if (letter === ' ') {
      key.style.display = 'flex'
      key.style.justifyContent = 'center'
      key.style.alignItems = 'center'
      key.style.gridArea = 'space'
      key.style.gridColumn = 'span 1'
      key.style.gridRow = 'span 1'

    } else {
      const bigKey = ['enter', 'back']

      if (letter === 'back') {
        key.insertAdjacentHTML('afterbegin', backSpaceSVG)
      } else {
        key.textContent = letter.toUpperCase()
      }

      key.setAttribute('data-key', letter)
      key.style.backgroundColor = keyboardKeyBackground(keys[letter])
      key.style.display = 'flex'
      key.style.justifyContent = 'center'
      key.style.alignItems = 'center'
      key.style.gridArea = 'key'
      key.style.gridColumn = bigKey.includes(letter) ? 'span 3' : 'span 2'
      key.style.gridRow = 'span 1'
      key.style.fontSize = letter === 'enter' ? '0.7rem' : '1.2rem'
      key.style.borderRadius = '0.3rem'
      key.style.cursor = 'pointer'
    }

    keyboardContainer.insertAdjacentElement('beforeend', key)
  }

  wordleSection.insertAdjacentElement('beforeend', keyboardContainer)
}

generateKeyboard(keys)

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
function boxBackgroundColor(letter, i) {
  if (WORD[i] === letter) return getColorFromCSSVar('--color-correct')
  if (WORD.includes(letter)) return getColorFromCSSVar('--color-present')
  return getColorFromCSSVar('--color-absent')
}

function updateKeyboardObject(letter, i) {
  if (WORD[i] === letter) return wordIs.correct
  if (WORD.includes(letter)) return wordIs.present
  return wordIs.notPresent
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

    // Prevents adding too many notifications.
    if (messagesCount <= 10) {
      addMessage('Not enough letters')
    }
  } else {

    /**
     * Animate the letters in sequence, giving each box the appropriate background color.
     * @param {number} i - The starting index. 0 is the default.
     */
    async function animateLetters(i = 0) {
      if (i > 4) return;

      const box = boxes[i];
      const currentLetter = box.textContent?.toLowerCase();
      const an = box.animate(scaleToZeroAnimation, { duration: 150, fill: 'forwards' });
      an.play();

      await new Promise(resolve => {
        an.onfinish = (() => {
          box.style.backgroundColor = boxBackgroundColor(currentLetter, i);
          box.style.borderColor = boxBackgroundColor(currentLetter, i);
          const revAn = box.animate(scaleTo100, { duration: 150, fill: 'forwards' })
          revAn.onfinish = () => resolve()
        })
      });

      await animateLetters(i + 1);
    }

    await animateLetters()


    if (wordStatus === wordIs.correct) {

      /**
       * Add the "jumpy" animation.
       * @param {number} i - The starting index. Default is 0.
       */
      function animateSuccess(i = 0) {
        if (i > 4) return;

        const an = boxes[i].animate(successAnimation, {
          duration: 600, easing: 'cubic-bezier(0.6, -0.28, 0.74, 1.35)'
        });

        an.play();
        setTimeout(() => animateSuccess(i + 1), 100);
      }

      setTimeout(animateSuccess, 500)
      GAME_STATE = 'END';
    }

    boxes.forEach((box, i) => {
      const letter = box.textContent.toLowerCase()
      keys[letter] = keys[letter] !== wordIs.correct ? updateKeyboardObject(letter, i) : wordIs.correct
    })
    generateKeyboard(keys)

    const isLastRow = CURRENT_ROW === ROWS - 1

    if (wordStatus === wordIs.present && isLastRow) {
      addMessage(capitalize(WORD), true)
      GAME_STATE = 'END'
    }
    CURRENT_ROW++
  }
}

function keyboardFeedback() {

}

/**
 * Creates the container for the messages.
 */
function createMessageModalContainer() {
  const modal = document.createElement('div')
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
function addMessage(message, fixed = false) {
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

  if (!fixed) timeout = setTimeout(() => removeModalsMessages(), 1000)
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

    const an = message.animate(fadeOut, { duration: 100, fill: 'forwards' })
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

/**
 * Make the first letter of every word a capital letter. "First letter" means a letter after a space.
 * @param {string} string - A string of one or more letters
 */
function capitalize(string) {
  const arr = string.split(' ')
  const firstCapital = arr.map(str => str[0].toUpperCase() + str.slice(1))
  return firstCapital.join(' ')
}