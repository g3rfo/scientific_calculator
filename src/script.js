// top-bar
const openModeSelection = document.querySelector('.change-mode-button');
const topBarTitle = document.querySelector('.title');
// mode-selection-aside
const modeSelectionAside = document.querySelector('.mode-selection');
const selectStandartMode = document.querySelector('.mode-1');
const selectScientificMode = document.querySelector('.mode-2');
// display
const display = document.querySelector('.display');
const expression = document.querySelector('.expression');
const result = document.querySelector('.result');
const expressionFontSize = getPxToNumberValue(getComputedStyle(expression).fontSize);
const resultFontSize = getPxToNumberValue(getComputedStyle(result).fontSize);
// numpad
const numpad = document.querySelector('.numpad');
const numpadButtons = document.querySelectorAll('.numpad-button');
const extendedButton = document.querySelector('.extended-button');
const scientificModeButtons = document.querySelectorAll('.scientific-mode');

// common functions

function isVisible(element) {
  return getComputedStyle(element).opacity !== '0';
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

function hideModeSelection() {
  modeSelectionAside.style.transform = 'translateX(-100%)';
  setTimeout(() => hideElement(modeSelectionAside), 300);
}

function displayModeStandart() {
  numpad.style.gridTemplateRows = 'repeat(5, 80px)';
  numpad.style.gridTemplateColumns = 'repeat(4, 80px)';
  numpad.style.gap = '21px 15px';

  extendedButton.style.gridColumn = '1 / 3';

  numpadButtons.forEach(button => {
    button.style.fontSize = '3rem';
  });
  
  scientificModeButtons.forEach(button => {
    button.style.display = 'none';
  });
}

function displayModeScientific() {
  numpad.style.gridTemplateRows = 'repeat(7, 60px)';
  numpad.style.gridTemplateColumns = 'repeat(5, 60px)';
  numpad.style.gap = '10px 15px';

  extendedButton.style.gridColumn = '2 / 4';

  numpadButtons.forEach(button => {
    button.style.fontSize = '2rem';
  });

  scientificModeButtons.forEach(button => {
    button.style.display = 'block';
  });
}

function getPxToNumberValue(value) {
  return Number(value.slice(0, -2));
}

function setFittedFontSize(element, elementBasicFontSize) {
  textFit(element, {
    reProcess: true,
    minFontSize: elementBasicFontSize / 2,
    maxFontSize: elementBasicFontSize
  })
}

// change-mode handling

openModeSelection.addEventListener('click', () => {
  showElement(modeSelectionAside);
  modeSelectionAside.style.transform = 'translateX(0)';
  setTimeout(() => {
    hideElement(display);
    hideElement(numpad);
  }, 300);
})

selectStandartMode.addEventListener('click', () => {
  topBarTitle.innerText = 'Standart';
  showElement(display);
  showElement(numpad);
  displayModeStandart();
  hideModeSelection();
})

selectScientificMode.addEventListener('click', () => {
  topBarTitle.innerText = 'Scientific';
  showElement(display);
  showElement(numpad);
  displayModeScientific();
  hideModeSelection();
})

// standart and sciensific calculator

let expressionToCalc = '';
let isLastOperationWasPercentage = false;

numpad.addEventListener('click', (event) => {
  let currentResultText = result.textContent;
  let currentExpressionText = expression.textContent;
  
  // clear
  if (event.target.closest('.button-clear')) {
    expression.textContent = '';
    result.textContent = '0';
    expressionToCalc = '';
    setFittedFontSize(result, resultFontSize);
  }
  
  // delete
  if (event.target.closest('.button-delete')) {
    if(currentResultText) {
      const textLength = currentResultText.length;

      if (textLength === 1) {
        result.textContent = '0';
      } else {
        result.textContent = currentResultText.slice(0, textLength - 1);
      }
      setFittedFontSize(result, resultFontSize);
    }
  } 
  
  // entering expressions
  if (event.target.closest('.button-number')) {
    const symbol = event.target.textContent;

    if (currentResultText === '0' || currentResultText === ' ') {
      result.textContent = symbol;
    } else {
      result.textContent += symbol;
    }

    setFittedFontSize(result, resultFontSize);
    console.log(expressionToCalc);
  }

  if (event.target.closest('.button-decimal')) {
    if (currentResultText.charAt(currentResultText.length - 1) === ' ') {
      result.textContent += '0.';
    } else {
      result.textContent += '.';
    }
    setFittedFontSize(result, resultFontSize);
  }
  
  if (event.target.closest('.button-operator')) {
    let operator = '';
    let symbol = event.target.textContent;
    expressionToCalc += currentResultText;

    isLastOperationWasPercentage = false;

    switch(symbol) {
      case '÷':
        operator = '/';
        break;

      case '×':
        operator = '*';
        break;

      case '%':
        isLastOperationWasPercentage = true;
        console.log(isLastOperationWasPercentage);
        operator = '';
        const line = expressionToCalc;
        const numArray = line.split(/[\s+\-*/]+/);

        const arrayLength = numArray.length;
        operator = eval(numArray[arrayLength-2] * numArray[arrayLength-1] / 100);
        
        symbol = String(operator);
        expressionToCalc = expressionToCalc.replace(numArray[arrayLength-1], operator);
        break;

      default:
        operator = symbol;
        break;
    }

    console.log(operator, symbol);

    if (currentExpressionText.charAt(currentExpressionText.length - 2) === '=') {
      expressionToCalc = currentResultText + ' ' + operator + ' ';
      expression.textContent = currentResultText + ' ' + symbol + ' ';
    } else if (parseFloat(symbol) || symbol === '0') {
      expression.textContent += symbol;
    } else {
      expressionToCalc += ' ' + operator + ' ';
      expression.textContent += currentResultText + ' ' + symbol + ' ';
    }
    setFittedFontSize(expression, expressionFontSize);
    result.textContent = '0';
    setFittedFontSize(result, resultFontSize);
  } 
  
  // calculate
  if (event.target.closest('.button-equals')) {
    if (currentExpressionText.charAt(currentExpressionText.length - 2) !== '=') {
      if (!isLastOperationWasPercentage) {
        expressionToCalc += currentResultText;
        expression.textContent += currentResultText + ' = ';
      } else {
        expression.textContent += ' = ';
      }
    
      setFittedFontSize(expression, expressionFontSize);

      try {
        const evalResult = eval(expressionToCalc);
        if (isNaN(evalResult)) {
          result.textContent = 'Error';
        } else {
          result.textContent = evalResult;
        }
      } catch (error) {
        result.textContent = 'Error';
      }

      setFittedFontSize(result, resultFontSize);

      console.log(currentExpressionText);
      console.log(expressionToCalc);
    }
  }
});

