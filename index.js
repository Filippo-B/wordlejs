'use strict'
const root = document.getElementById('root');
const WORD = 'PANIC';
const ROWS = 6;
const COLS = 5;

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
  header.insertAdjacentElement('afterbegin', title)

  /* =================================== § WORDLE CONTAINER === */
  const wordleSection = document.createElement('section')
  wordleSection.style.display = 'flex'
  wordleSection.style.justifyContent = 'center'
  wordleSection.style.width = '100%'
  header.insertAdjacentElement("afterend", wordleSection)

  const wordleContiner = document.createElement('div')
  wordleContiner.style.display = 'grid'
  wordleContiner.style.gridTemplateColumns = 'repeat(5, 62px)'
  wordleContiner.style.gridTemplateRows = 'repeat(6, 62px)'
  wordleContiner.style.gap = '5px'


  /* =================================== § ROWS AND COLS === */
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const col = document.createElement('div')
      col.style.width = '100%'
      col.style.height = '100%'
      col.style.border = `2px solid ${getColorFromCSS('--color-absent')}`
      wordleContiner.insertAdjacentElement('beforeend', col)
    }
  }
  wordleSection.insertAdjacentElement('afterbegin', wordleContiner)
})()