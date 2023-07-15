'use strict'
/**
 * @typedef {Object} GameObject
 * @property {number} currentRow - the current row of the game
 * @property {string} gameState - the current state of the game
 * @property {string} word - the current word of the game
 * @property {Array} wordTracker - The array that keeps track of the letters in the word
 */

/**
 * @typedef {Object} TokenStatus
 * @property {string} correct - the letter is present in the word, and at the right place
 * @property {string} present - the word is present in a list, but it's not the correct
 * @property {string} notPresent - the word is not present in a list
 * @property {string} tooShort - the word is less than 5 letters long
 */
import { wordleLa } from './wordleLa.js'
import { wordleTa } from './wordleTa.js'
const root = document.getElementById('root');

const ROWS = 6;
const COLS = 5;

// Create the game object if it doesn't already exist
if (!getGameObjFromLS()) {
  addCleanGameObjToLS()
}

/**
 * @constant
 * @type {GameObject}
 * Get the game object from local storage.
 */
let gameObj = getGameObjFromLS()

let headerContainer = null
let wordleContainer = null
let wordleSection = null
let notificationContainer = null
let keyboardContainer = null

/**
* @type {TokenStatus}
 * The status of a word or letter
 */
const tokenIs = {
  correct: 'correct',
  present: 'present',
  notPresent: 'notPresent',
  tooShort: 'tooShort'
}

const backSpaceSVG = `<svg style="width:1.5rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" /> </svg>`

/**
 * This object contains all the letters that goes in the keyboard and their status (present, not-present, etc).
 */
let keys = {
  'q': '', 'w': '', 'e': '', 'r': '', 't': '', 'y': '', 'u': '', 'i': '', 'o': '', 'p': '',
  ' ': '', 'a': '', 's': '', 'd': '', 'f': '', 'g': '', 'h': '', 'j': '', 'k': '', 'l': '', ' ': '',
  'enter': '', 'z': '', 'x': '', 'c': '', 'v': '', 'b': '', 'n': '', 'm': '', 'back': ''
}

/**
 * @return  A random word from the list of valid words.
 */
function selectRandomWord() {
  let words = Array.from(wordleLa);
  return words[Math.floor(Math.random() * words.length)];
}

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
 * Animation of a box when a new letter is added.
 */
const addLetterFeedbackAnimation = [
  { transform: 'scale(1.1)' },
  { transform: 'scale(1)' },
]

/**
 * Shaking animation. Used, for example, when the user enters a word that isn't present in any list.
 */
const shakingAnimation = [
  { transform: 'translateX(-4px)' },
  { transform: 'translateX(+4px)' },
  { transform: 'translateX(-4px)' },
  { transform: 'translateX(+4px)' },
  { transform: 'translateX(-4px)' },
  { transform: 'translateX(+4px)' },
  { transform: 'translateX(0)' },
]

/**
 * Scale to 0 vertically.
 * @type {Array.<object>}
 */
const scaleToZeroAnimation = [
  { transform: 'scaleY(100%)' },
  { transform: 'scaleY(0)' },
]

/**
 * Scale to 100% vertically. Used in combination with <code>scaleToZeroAnimation</code>
 * @type {Array.<object>}
 */
const scaleTo100Animation = [
  { transform: 'scaleY(100%)' },
]

const fadeOutAnimation = [
  { opacity: 1 },
  { opacity: 0 }
]

/**
 * The elements “jumps”. Used when the user finds the right word.
 */
const jumpAnimation = [
  { transform: 'translateY(0)' },
  { transform: 'translateY(-30px)' },
  { transform: 'translateY(0)' }
]

/* ============================================ */
/* ··········································· § HEADER ··· */
/* ======================================== */

/**
 * Create the header with the title and the menu.
 */
function createHeader() {
  const header = document.createElement('header')
  header.style.width = '100%'
  header.style.padding = '20px 0'
  header.style.borderBottom = `1px solid ${getColorFromCSSVar('--color-tone-3')}`
  header.style.textAlign = `center`
  header.style.marginBottom = '6rem'
  header.style.display = 'flex'
  header.style.gap = '0.5rem'
  header.style.flexDirection = 'column'
  header.id = 'headerContainer'
  root.insertAdjacentElement('afterbegin', header)
  headerContainer = document.getElementById('headerContainer')

  /* =================================== § HEADER TITLE === */
  const title = document.createElement('h1')
  title.textContent = 'WordleJS'
  title.style.fontFamily = '"Roboto Slab", serif'
  title.style.fontSize = '38px'
  title.style.fontWeight = '700'

  const subtitle = document.createElement('p')
  subtitle.innerHTML = 'A Wordle clone in vanilla JS by <a href="https://github.com/Filippo-b">Filippo Bristot</a>'
  header.insertAdjacentElement('afterbegin', subtitle)
  header.insertAdjacentElement('afterbegin', title)

  /* =================================== § MENU === */
  const menu = document.createElement('nav')
  menu.style.display = 'flex'
  menu.style.flexDirection = 'row'
  menu.style.gap = '0.9rem'
  menu.style.justifyContent = 'center'

  /**
   * The “Cheat” menu element contains the right word, which will be visible after clicking on it.
   */
  const cheat = document.createElement('p')
  cheat.textContent = 'Cheat'
  cheat.id = 'cheatMenu'

  cheat.style.textDecoration = 'underline'
  cheat.style.cursor = 'pointer'

  cheat.addEventListener('click', () => {
    if (cheat.textContent !== gameObj.word) {
      cheat.textContent = capitalize(gameObj.word) + ' 😜'
      cheat.style.textDecoration = 'unset'
    }

  })

  const about = document.createElement('a')
  about.textContent = 'More about this project'
  about.href = 'https://github.com/Filippo-B/wordlejs'

  about.style.textDecoration = 'underline'
  about.style.cursor = 'pointer'

  const newGame = document.createElement('p')
  newGame.textContent = 'New game'
  newGame.style.textDecoration = 'underline'
  newGame.style.cursor = 'pointer'

  newGame.addEventListener('click', () => {
    startNewGame()
  })

  menu.insertAdjacentElement('beforeend', newGame)
  menu.insertAdjacentElement('beforeend', cheat)
  menu.insertAdjacentElement('beforeend', about)
  header.insertAdjacentElement('beforeend', menu)
}
createHeader()

/* ============================================ */
/* ··········································· § WORDLE CONTAINER ··· */
/* ======================================== */
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
      const currentLetter = gameObj.wordTracker[i][j]
      const box = document.createElement('div')
      box.style.width = '100%'
      box.style.height = '100%'
      box.style.border = `2px solid ${getColorFromCSSVar('--color-absent')}`
      box.style.display = 'flex'
      box.style.justifyContent = 'center'
      box.style.alignItems = 'center'
      box.style.textTransform = 'uppercase'
      box.style.fontSize = '2rem'
      box.style.backgroundColor = boxBackgroundColor(currentLetter, j);
      box.style.borderColor = boxBackgroundColor(currentLetter, j);
      keys[currentLetter] = updateLetterInKeyboardObject(currentLetter, j)

      box.textContent = currentLetter
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
 * Returns the appropriate css color based on the current letter status
 * @param {String} letterStatus - Whether the word, is present, not present or correct.
 * @return - A css color.
 */
function keyboardKeyBackground(letterStatus) {
  if (letterStatus === tokenIs.present) return getColorFromCSSVar('--color-present')
  if (letterStatus === tokenIs.notPresent) return getColorFromCSSVar('--color-absent')
  if (letterStatus === tokenIs.correct) return getColorFromCSSVar('--color-correct')
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
      key.classList.add('keyboard-key')

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

/**
 * Add the click event to the keyboard keys.
 */
function keyboardClickEvent() {
  keyboardContainer.addEventListener('click', e => {
    /**
     * Check if the target has a key attribute. If not, it looks on its parent to find one.
     */
    const key = e.target.dataset.key || e.path.find(el => el.classList.contains('keyboard-key')).dataset.key

    if (key) {
      if (key === 'enter') {
        const currentWord = gameObj.wordTracker[gameObj.currentRow].join('')
        boxFeedback(checkWord(currentWord))
      } else if (key === 'back') {
        removeLetter()
      } else {
        addLetter(key)
      }
    }
  })
}

generateKeyboard(keys)
keyboardClickEvent()
/* ============================================ */
/* ··········································· § WORDLE GRID FUNCTIONALITY ··· */
/* ======================================== */
/**
 * Adds a letter to the first empty box of the active row.
 * @param {string} letter - The letter to add.
 */
function addLetter(letter) {
  const firstEmptySpace = gameObj.wordTracker[gameObj.currentRow].indexOf('')

  if (firstEmptySpace !== -1) {
    gameObj.wordTracker[gameObj.currentRow][firstEmptySpace] = letter
    const boxElement = document.querySelector(`[data-box="${gameObj.currentRow},${firstEmptySpace}"]`)
    boxElement.textContent = letter.toUpperCase()
    boxElement.style.border = `2px solid ${getColorFromCSSVar('--color-tone-3')}`
    boxElement.animate(addLetterFeedbackAnimation, 50)
  }
}

/**
 * Removes the last letter of the active row.
 */
function removeLetter() {
  const lastLetter = gameObj.wordTracker[gameObj.currentRow].findLastIndex(l => l !== '')

  if (lastLetter !== -1) {
    gameObj.wordTracker[gameObj.currentRow][lastLetter] = ''
    const boxElement = document.querySelector(`[data-box="${gameObj.currentRow},${lastLetter}"]`)
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

  if (word === gameObj.word) return tokenIs.correct
  if (wordleLa.has(word) || wordleTa.has(word)) return tokenIs.present
  if (word.length < 5) return tokenIs.tooShort
  else return tokenIs.notPresent
}

/**
 * Checks a letter and output the appropriate color if it's present in WORD.
 * @param {string} letter - The letter to check.
 * @param {number} i - The index.
 * @returns {string} - The color.
 */
function boxBackgroundColor(letter, i) {
  if (letter !== '') {
    if (gameObj.word[i] === letter) return getColorFromCSSVar('--color-correct')
    if (gameObj.word.includes(letter)) return getColorFromCSSVar('--color-present')
    return getColorFromCSSVar('--color-absent')
  }
}

/**
 * Updates the keys object with the current status for every key.
 * @param {string} letter - The letter to check.
 * @param {number} i - The index.   
 */
function updateLetterInKeyboardObject(letter, i) {
  if (keys[letter] !== tokenIs.correct) {
    if (gameObj.word[i] === letter) return tokenIs.correct
    if (gameObj.word.includes(letter)) return tokenIs.present
    return tokenIs.notPresent
  }
  return tokenIs.correct
}

/**
 * Change the background color of the boxes based on wherther a letter is correct / present / absent.
 * @param {string} wordStatus - Whether the word is correct, present or not present
 */
async function boxFeedback(wordStatus) {
  gameObj.gameState = 'WAIT'
  const currentRowEl = document.querySelector(`[data-row="${gameObj.currentRow}"`)
  const boxes = currentRowEl.querySelectorAll('div')
  const messagesCount = Array.from(notificationContainer.querySelectorAll('.message')).length

  if (wordStatus === tokenIs.notPresent) {
    currentRowEl.animate(shakingAnimation, 300)
    addAndRemoveNotification('Not in word list')
    gameObj.gameState = 'PLAY'
  } else if (wordStatus === tokenIs.tooShort) {
    currentRowEl.animate(shakingAnimation, 300)
    gameObj.gameState = 'PLAY'

    // Prevents adding too many notifications.
    if (messagesCount <= 10) {
      addAndRemoveNotification('Not enough letters')
    }
  } else {

    /**
     * Animate the letters in sequence, giving each box the appropriate background color.
     * @param {number} [i=0] - The starting index. Default is 0.
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
          const revAn = box.animate(scaleTo100Animation, { duration: 150, fill: 'forwards' })
          revAn.onfinish = () => resolve()
        })
      });

      await animateLetters(i + 1);
    }

    await animateLetters()

    if (wordStatus === tokenIs.correct) {

      /**
       * Add the "correct word" animation.
       * @param {number} [i=0] - The starting index. Default is 0.
       */
      function animateSuccess(i = 0) {
        if (i > 4) return;

        const an = boxes[i].animate(jumpAnimation, {
          duration: 600, easing: 'cubic-bezier(0.6, -0.28, 0.74, 1.35)'
        });

        an.play();
        setTimeout(() => animateSuccess(i + 1), 100);
      }

      setTimeout(animateSuccess, 500)
      gameObj.gameState = 'END';
    }

    boxes.forEach((box, i) => {
      const letter = box.textContent.toLowerCase()

      if (keys[letter] !== tokenIs.correct) {
        keys[letter] = updateLetterInKeyboardObject(letter, i)
      }
    })

    generateKeyboard(keys)

    const isLastRow = gameObj.currentRow === ROWS - 1

    if (gameObj.gameState !== 'END') {
      if (isLastRow) {
        if (wordStatus === tokenIs.present) {
          addAndRemoveNotification(capitalize(gameObj.word), true)
        }

        gameObj.gameState = 'END'
      } else {
        gameObj.currentRow++
        gameObj.gameState = 'PLAY'
      }
    }
    saveGameObjToLS(gameObj)
  }
}

/* ============================================ */
/* ··········································· § NOTIFICATION ··· */
/* ======================================== */
/**
 * Creates the container for the notifications.
 */
function createNotificationContainer() {
  const modal = document.createElement('div')
  modal.style.position = 'absolute'
  modal.style.top = '120px'
  modal.style.width = '100%'
  modal.style.display = 'flex'
  modal.style.flexDirection = 'column'
  modal.style.gap = '1rem'

  modal.style.alignItems = 'center'

  modal.id = 'notificationContainer'

  root.insertAdjacentElement('beforeend', modal)
  notificationContainer = document.getElementById('notificationContainer')
}

createNotificationContainer()

/**
 * Add a new message to the modal container.
 * @param {string} message - The content of the message.
 * @param {boolean} fixed - Whether the message should persist or not.
 */
let timeout = null
function addAndRemoveNotification(message, persistent = false) {
  if (timeout) clearTimeout(timeout)

  const notification = document.createElement('div')
  notification.textContent = message
  notification.classList.add('notification')

  notification.style.backgroundColor = 'white'
  notification.style.color = getColorFromCSSVar('--black')
  notification.style.borderRadius = '5px'
  notification.style.fontSize = '14px'
  notification.style.fontWeight = 'bold'
  notification.style.padding = '0.8rem 0.7rem'

  notificationContainer.insertAdjacentElement('afterBegin', notification)

  const messages = Array.from(notificationContainer.querySelectorAll('.notification'))

  // Makes sure that won't be added too many messages.
  if (messages.length > 8) messages[messages.length - 1].remove()

  if (!persistent) timeout = setTimeout(() => removeNotifications(), 1000)
}

/**
 * Removes the notifications one by one, starting from the last one.
 */
function removeNotifications() {
  const messagesEl = Array.from(notificationContainer.querySelectorAll('.notification'))
  let i = messagesEl.length - 1

  /**
   * Check if there is an element after the current one. If there is it means that another message has been added while the function was in execution, and it needs to stop on order to avoid messing up the animation.
   */
  function elementAfterCurrent() {
    return Array.from(notificationContainer.querySelectorAll('.notification'))[i + 1]
  }

  /**
   * Removes the message in sequence starting from the last one.
   * @param {number} i - The index of the last element.
   */
  function removeMessagesInSequence(i) {
    const message = messagesEl[i]

    if (i < 0) return
    if (elementAfterCurrent()) return

    const an = message.animate(fadeOutAnimation, { duration: 100, fill: 'forwards' })
    an.play()

    an.onfinish = () => {
      message.remove()
      removeMessagesInSequence(i - 1)
    }
  }
  removeMessagesInSequence(i)
}

/**
 * Reset the current game and start a new one.
 */
function startNewGame() {
  keys = {
    'q': '', 'w': '', 'e': '', 'r': '', 't': '', 'y': '', 'u': '', 'i': '', 'o': '', 'p': '',
    ' ': '', 'a': '', 's': '', 'd': '', 'f': '', 'g': '', 'h': '', 'j': '', 'k': '', 'l': '', ' ': '',
    'enter': '', 'z': '', 'x': '', 'c': '', 'v': '', 'b': '', 'n': '', 'm': '', 'back': ''
  }
  addCleanGameObjToLS()
  gameObj = getGameObjFromLS()
  document.getElementById('wordleContainer').innerHTML = ''
  document.getElementById('keyboardContainer').innerHTML = ''
  const cheatMenu = document.getElementById('cheatMenu')
  cheatMenu.textContent = 'Cheat'
  cheatMenu.style.textDecoration = 'underline'
  document.getElementById('notificationContainer').innerHTML = ''

  generateGrid()
  generateKeyboard(keys)
}

/* ============================================ */
/* ··········································· § TYPING ··· */
/* ======================================== */
/**
 * Check wether the modifier keys are pressed.
 * @return {Boolean} true of shift, cmd, ctrl or alt are pressed, false otherwise.
 */
function modifierState(e) {
  return !e.altKey
    && !e.metaKey
    && !e.ctrlKey
    && !e.shiftKey
}

window.addEventListener('keydown', (e) => {
  // console.log(e.key)
  if (gameObj.gameState === 'PLAY' && modifierState(e)) {
    if (isValidLetter(e.key)) {
      addLetter(e.key)
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      removeLetter()
    } else if (e.key === 'Enter') {
      const currentWord = gameObj.wordTracker[gameObj.currentRow].join('')
      boxFeedback(checkWord(currentWord))
    }
  }
})

/* ============================================ */
/* ··········································· § LOCALSTORAGE ··· */
/* ======================================== */
/**
 * Gets the game object from local storage.
 */
function getGameObjFromLS() {
  return JSON.parse(window.localStorage.getItem('gameObj'))
}

/**
 * Saves the game object to local storage.
 * @param {Object} gameObj - The game object to save.
 */
function saveGameObjToLS(gameObj) {
  if (!gameObj) throw new Error('No game object to save.')
  window.localStorage.setItem('gameObj', JSON.stringify(gameObj))
}

/**
 * Adds a clean game object to local storage.
 */
function addCleanGameObjToLS() {
  const gameObj = {
    currentRow: 0,
    gameState: 'PLAY',
    word: selectRandomWord(),
    wordTracker: generateCleanWordTracker()
  }
  window.localStorage.setItem('gameObj', JSON.stringify(gameObj))
}

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

/**
 * Generates a clean word tracker.
 * @returns {Array} A clean word tracker array
 */
function generateCleanWordTracker() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ''))
}
