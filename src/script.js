// top-bar
const openModeSelection = document.querySelector('.change-mode-button');
const topBarTitle = document.querySelector('.title');
// mode-selection-aside
const modeSelectionAside = document.querySelector('.mode-selection');
const selectStandartMode = document.querySelector('.mode-1');
// display
const display = document.querySelector('.display');
const expression = document.querySelector('.expression');
const result = document.querySelector('.result');
// numpad
const numpad = document.querySelector('.numpad');


// common functions

function isVisible(element) {
  return Number(getComputedStyle(element).opacity);
}

function hideElement(element) {
  if (isVisible(element)) {
    element.style.opacity = '0';
    element.style.pointerEvents = 'none';
    console.log(element.className + ' was hidden');
  }
}

function showElement(element) {
  if (!isVisible(element)) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
    console.log(element.className + ' was showed');
  }
}

// change-mode handling

openModeSelection.addEventListener('click', () => {
  showElement(modeSelectionAside);
})

selectStandartMode.addEventListener('click', () => {
  topBarTitle.innerText = 'Standart';
  showElement(display);
  showElement(numpad);
  hideElement(modeSelectionAside);
})

// standart and sciensific calculator

numpad.addEventListener('click', (event) => {
  let currentResultText = result.textContent;
  
  // clear
  if (event.target.closest('.button-clear')) {
    expression.innerText = '';
    result.innerText = '0';
  // delete
  } else if (event.target.closest('.button-delete')) {
    if(currentResultText) {
      const textLength = currentResultText.length;
      if (textLength === 1) {
        result.innerText = '0';
      } else {
        result.textContent = currentResultText.slice(0, textLength - 1);
      }
    }
  // update result expression
  } else if (event.target.closest('.button-number') || event.target.closest('.button-decimal')) {
    const symbol = event.target.innerText;
    currentResultText === '0' ? result.textContent = symbol : result.textContent += symbol;
  } else if (event.target.closest('.button-operator')) {
    const operator = event.target.innerText;
    result.textContent += ' ' + operator + ' ';
  // calculate
  } else if (event.target.closest('.button-equals')) {
    result.innerText = eval(result.innerText);
  }
});

