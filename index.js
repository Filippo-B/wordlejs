'use strict'
const root = document.getElementById('root');
const WORD = 'PANIC';
const ROWS = 6;
const COLS = 5;
const CURRENT_ROW = 0
const wordTracker = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ''))
console.log(wordTracker)

let headerContainer = null
let wordleContainer = null
let wordleSection = null

/* ============================================ */
/* ··········································· § HEADER ··· */
/* ======================================== */

/* =================================== § HEADER CONTAINER === */

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
/* ··········································· § TYPING ··· */
/* ======================================== */
window.addEventListener('keydown', (e) => {
  console.log(e.key)
  if (isValidLetter(e.key)) {
    addLetter(e)
  } else if (e.key === 'Backspace') {
    removeLetter(e)
  }
})

/**
 * Adds a letter to the first empty box of the active row.
 */
function addLetter(e) {
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
 * Animation of a box when a new letter is added
 */
const pressKeyFeedbackAnimation = [
  { transform: 'scale(1.1)' },
  { transform: 'scale(1)' },
]

/**
 * Get the color from a CSS variable.
 * @param {string} name The name of the CSS variable --something-something
 * @returns {string} The hex of the color.
 */
function getColorFromCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}