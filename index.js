'use strict'
const root = document.getElementById('root');
const WORD = 'PANIC';
const ROWS = 6;
const COLS = 5;
const CURRENT_ROW = 0
const wordTracker = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ''))
console.log(wordTracker)

function getColorFromCSS(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}

(function () {

  /* ============================================ */
  /* ··········································· § HEADER ··· */
  /* ======================================== */

  /* =================================== § HEADER CONTAINER === */

  const header = document.createElement('header')
  header.style.width = '100%'
  header.style.padding = '20px 0'
  header.style.borderBottom = `1px solid ${getColorFromCSS('--color-tone-3')}`
  header.style.textAlign = `center`
  header.style.marginBottom = '6rem'
  root.insertAdjacentElement('afterbegin', header)

  /* =================================== § HEADER TITLE === */
  const title = document.createElement('h1')
  title.textContent = 'Wordle'
  title.style.fontFamily = '"Roboto Slab", serif'
  title.style.fontSize = '38px'
  title.style.fontWeight = '700'
  header.insertAdjacentElement('afterbegin', title)

  /* =================================== § WORDLE CONTAINER === */
  const wordleSection = document.createElement('section')
  wordleSection.style.display = 'flex'
  wordleSection.style.justifyContent = 'center'
  wordleSection.style.width = '100%'
  header.insertAdjacentElement("afterend", wordleSection)

  const wordleContiner = document.createElement('div')
  wordleContiner.style.display = 'grid'
  wordleContiner.style.gridTemplateRows = 'repeat(6, 62px)'
  wordleContiner.style.gap = '5px'


  /* =================================== § ROWS AND COLS === */
  function generateColumns() {

    for (let i = 0; i < ROWS; i++) {
      const row = document.createElement('div')
      row.style.display = 'grid'
      row.style.gridTemplateColumns = 'repeat(5, 62px)'
      row.style.gap = '5px'
      wordleContiner.insertAdjacentElement('beforeend', row)

      for (let j = 0; j < COLS; j++) {
        const box = document.createElement('div')
        box.style.width = '100%'
        box.style.height = '100%'
        box.style.border = `2px solid ${getColorFromCSS('--color-absent')}`
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
    wordleSection.insertAdjacentElement('afterbegin', wordleContiner)
  }
  generateColumns()

  /* =================================== § TYPING === */
  window.addEventListener('keydown', (e) => {
    console.log(e.key)
    if (isValidLetter(e.key)) {
      addLetter(e)
      // generateColumns()
    } else if (e.key === 'Backspace') {
      removeLetter(e)
    }
  })

  function addLetter(e) {
    const firstEmptySpace = wordTracker[CURRENT_ROW].indexOf('')
    if (firstEmptySpace !== -1) {
      wordTracker[CURRENT_ROW][firstEmptySpace] = e.key
      console.log(`[data-box="${CURRENT_ROW},${firstEmptySpace}]`)
      const boxElement = document.querySelector(`[data-box="${CURRENT_ROW},${firstEmptySpace}"]`)
      boxElement.textContent = e.key.toUpperCase()
      boxElement.style.border = `2px solid ${getColorFromCSS('--color-tone-3')}`

      const feedbackAnimation = [
        { transform: 'scale(1.1)' },
        { transform: 'scale(1)' },
      ]

      const feedbackAnimationTiming = {
        duration: 100,
        iterations: 1
      }

      boxElement.animate(feedbackAnimation, 50)
    }
  }

  function removeLetter(e) {
    const lastLetter = wordTracker[CURRENT_ROW].findLastIndex(l => l !== '')

    if (lastLetter !== -1) {
      wordTracker[CURRENT_ROW][lastLetter] = ''
      const boxElement = document.querySelector(`[data-box="${CURRENT_ROW},${lastLetter}"]`)
      boxElement.textContent = ''
      boxElement.style.border = `2px solid ${getColorFromCSS('--color-absent')}`
    }

  }

  /* ============================================ */
  /* ··········································· § UTILS ··· */
  /* ======================================== */
  function isValidLetter(letter) {
    return /^[a-z]{1}$/i.test(letter)
  }
})()