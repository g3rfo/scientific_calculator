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

function getPxToNumberValue(value) {
  return Number(value.slice(0, -2));
}

function setFittedFontSize(element, elementBasicFontSize) {
  textFit(element, {
    reProcess: true,
    maxFontSize: elementBasicFontSize
  })
  console.log(elementBasicFontSize);
}

// change-mode handling

openModeSelection.addEventListener('click', () => {
  showElement(modeSelectionAside);
  modeSelectionAside.style.transform = 'translateX(0)';
  console.log('openSelection');
})

selectStandartMode.addEventListener('click', () => {
  topBarTitle.innerText = 'Standart';
  showElement(display);
  showElement(numpad);
  modeSelectionAside.style.transform = 'translateX(-100%)';
  setTimeout(() => hideElement(modeSelectionAside), 200);
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
    setFittedFontSize(result, getPxToNumberValue(getComputedStyle(result).fontSize));
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
      setFittedFontSize(result, getPxToNumberValue(getComputedStyle(result).fontSize));
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

    setFittedFontSize(result, getPxToNumberValue(getComputedStyle(result).fontSize));
    console.log(expressionToCalc);
  }

  if (event.target.closest('.button-decimal')) {
    if (currentResultText.charAt(currentResultText.length - 1) === ' ') {
      result.textContent += '0.';
    } else {
      result.textContent += '.';
    }
    setFittedFontSize(result, getPxToNumberValue(getComputedStyle(result).fontSize));
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
    setFittedFontSize(expression, getPxToNumberValue(getComputedStyle(expression).fontSize));
    result.textContent = '0';
    setFittedFontSize(result, getPxToNumberValue(getComputedStyle(result).fontSize));
  } 
  
  // calculate
  if (event.target.closest('.button-equals')) {
    if (!isLastOperationWasPercentage) {
      expressionToCalc += currentResultText;
      expression.textContent += currentResultText + ' = ';
    } else {
      expression.textContent += ' = ';
    }
    
    setFittedFontSize(expression, getPxToNumberValue(getComputedStyle(expression).fontSize));

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

    setFittedFontSize(result, getPxToNumberValue(getComputedStyle(result).fontSize));

    console.log(currentExpressionText);
    console.log(expressionToCalc);
  }
});

