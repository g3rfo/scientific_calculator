// top-bar
const openModeSelection = document.querySelector('.change-mode-button');
const topBarTitle = document.querySelector('.title');
const openHistory = document.querySelector('.history-button');

// mode-selection-aside
const modeSelectionAside = document.querySelector('.mode-selection');
const selectStandartMode = document.querySelector('.mode-1');
const selectScientificMode = document.querySelector('.mode-2');
const selectDataCalculationMode = document.querySelector('.mode-3');
const selectCurrencyMode = document.querySelector('.mode-4');
const selectWeightAndMassMode = document.querySelector('.mode-5');
const selectTemperatureMode = document.querySelector('.mode-6');
const selectAreaMode = document.querySelector('.mode-7');
const selectTimeMode = document.querySelector('.mode-8');
const selectPowerMode = document.querySelector('.mode-9');
const selectDataMode = document.querySelector('.mode-10');

// display
const display = document.querySelector('.display');
const expression = document.querySelector('.expression');
const result = document.querySelector('.result');
const expressionFontSize = getPxToNumberValue(getComputedStyle(expression).fontSize);
const resultFontSize = getPxToNumberValue(getComputedStyle(result).fontSize);

// display from to mode
let isCurrentFromToMode = false;

const displayFromToMode = document.querySelector('.display-from-to-mode');
const firstSelectionList = document.getElementById('first-select');
const secondSelectionList = document.getElementById('second-select');
const firstUnit = document.querySelector('.first-unit');
const secondUnit = document.querySelector('.second-unit');
const firstUnitText = document.querySelector('.first-unit-result');
const secondUnitText = document.querySelector('.second-unit-result');

const temperature = ['Celsius', 'Fahrenheit', 'Kelvin'];

// numpad
const numpad = document.querySelector('.numpad');
const numpadButtons = document.querySelectorAll('.numpad-button');
const buttonEquals = document.querySelector('.button-equals');
const extendedButtonZero = document.querySelector('.extended-button-zero');
const extendedButtonClear = document.querySelector('.extended-button-clear');
const extendedButtonDelete = document.querySelector('.extended-button-delete');
const scientificModeButtons = document.querySelectorAll('.scientific-mode');
const operatorButtons = document.querySelectorAll('.button-operator');

// math
const PI = Math.PI;
const E = Math.E;

// common functions

function isVisible(element) {
  const displayValue = getComputedStyle(element).display;
  return displayValue !== 'none' && displayValue !== '';
}

function hideElement(element) {
  if (isVisible(element)) {
    element.style.display = 'none';
  }
}

function showElement(element, displayStyle) {
  if (!isVisible(element)) {
    element.style.display = displayStyle;
  }
}

function resetDisplayValue(element, value) {
  element.textContent = value;
}

function hideModeSelection() {
  modeSelectionAside.style.transform = 'translateX(-100%)';
  setTimeout(() => hideElement(modeSelectionAside), 300);
}

function displayModeSmallest() {
  numpad.style.gridTemplateRows = 'repeat(4, 80px)';
  numpad.style.gridTemplateColumns = 'repeat(4, 80px)';
  numpad.style.gap = '21px 15px';

  extendedButtonZero.style.gridColumn = '2 / 3';
  extendedButtonClear.style.gridColumn = '4 / 5';
  extendedButtonClear.style.gridRow = '1 / 3';
  extendedButtonDelete.style.gridColumn = '4 / 5';
  extendedButtonDelete.style.gridRow = '3 / 5';

  numpadButtons.forEach(button => {
    button.style.fontSize = '3rem';
  });
  
  operatorButtons.forEach(button => {
    button.style.display = 'none';
  });

  scientificModeButtons.forEach(button => {
    button.style.display = 'none';
  });

  document.querySelector('.button-switchToNegative').style.display = 'block';

  buttonEquals.style.display = 'none';
}

function displayModeStandart() {
  numpad.style.gridTemplateRows = 'repeat(5, 80px)';
  numpad.style.gridTemplateColumns = 'repeat(4, 80px)';
  numpad.style.gap = '21px 15px';

  extendedButtonZero.style.gridColumn = '1 / 3';
  extendedButtonClear.style.gridColumn = '1 / 2';
  extendedButtonClear.style.gridRow = '1 / 2';
  extendedButtonDelete.style.gridColumn = '4 / 5';
  extendedButtonDelete.style.gridRow = '1 / 2';

  numpadButtons.forEach(button => {
    button.style.fontSize = '3rem';
  });
  
  operatorButtons.forEach(button => {
    button.style.display = 'block';
  });

  scientificModeButtons.forEach(button => {
    button.style.display = 'none';
  });

  buttonEquals.style.display = 'block';

  resetDisplayValue(expression, '');
  resetDisplayValue(result, '0');
}

function displayModeScientific() {
  numpad.style.gridTemplateRows = 'repeat(7, 60px)';
  numpad.style.gridTemplateColumns = 'repeat(5, 60px)';
  numpad.style.gap = '10px 15px';

  extendedButtonZero.style.gridColumn = '2 / 4';
  extendedButtonClear.style.gridColumn = '1 / 2';
  extendedButtonClear.style.gridRow = '1 / 2';
  extendedButtonDelete.style.gridColumn = '5 / 6';
  extendedButtonDelete.style.gridRow = '1 / 2';

  numpadButtons.forEach(button => {
    button.style.fontSize = '2rem';
  });

  scientificModeButtons.forEach(button => {
    button.style.display = 'block';
  });

  operatorButtons.forEach(button => {
    button.style.display = 'block';
  });

  buttonEquals.style.display = 'block';

  resetDisplayValue(expression, '');
  resetDisplayValue(result, '0');
}

function getPxToNumberValue(value) {
  return Number(value.slice(0, -2));
}

function setFittedFontSize(element, elementBasicFontSize) {
  textFit(element, {
    reProcess: true,
    minFontSize: elementBasicFontSize / 2,
    maxFontSize: elementBasicFontSize,
    detectMultiLine: false
  })
}

function getExpressionInBrackets(line) {
  const closeIndex = line.lastIndexOf(')');
  let openIndex = -1;
  if (closeIndex !== -1) {
    let depth = 0;
    for (let i = closeIndex - 1; i >= 0; i--) {
      if (line[i] === ')') {
        depth++;
      } else if (line[i] === '(') {
        if (depth === 0) {
          openIndex = i;
          break;
        } else {
          depth--;
        }
      }
    }
  }

  const numArray = line.split(/[\s+\-*/()]+/);
  const insideBrackets = (openIndex !== -1 && closeIndex !== -1)
    ? line.slice(openIndex + 1, closeIndex).trim()
    : '';
  return { openIndex, closeIndex, insideBrackets, numArray };
}

// change-mode handling

openModeSelection.addEventListener('click', () => {
  showElement(modeSelectionAside, 'flex');
  requestAnimationFrame(() => {
    modeSelectionAside.style.transform = 'translateX(0)';
  });
  setTimeout(() => {
    hideElement(display);
    hideElement(displayFromToMode);
    hideElement(numpad);
  }, 300);
})

selectStandartMode.addEventListener('click', () => {
  isCurrentFromToMode = false;
  topBarTitle.innerText = 'Standart';
  showElement(display, 'flex');
  showElement(numpad, 'grid');
  displayModeStandart();
  hideModeSelection();
})

selectScientificMode.addEventListener('click', () => {
  isCurrentFromToMode = false;
  topBarTitle.innerText = 'Scientific';
  showElement(display, 'flex');
  showElement(numpad, 'grid');
  displayModeScientific();
  hideModeSelection();
})

openHistory.addEventListener('click', () => {
  alert('То на новий рік');
})

selectDataCalculationMode.addEventListener('click', () => {
  alert('То на новий рік');
  // topBarTitle.innerText = 'Data Calculation';
  // hideModeSelection();
})

selectCurrencyMode.addEventListener('click', () => {
  alert('То на новий рік');
  // topBarTitle.innerText = 'Currency';
  // hideModeSelection();
})

selectWeightAndMassMode.addEventListener('click', () => {
  alert('То на новий рік');
  // topBarTitle.innerText = 'Weight & Mass';
  // hideModeSelection();
})

selectTemperatureMode.addEventListener('click', () => {
  isCurrentFromToMode = true;
  topBarTitle.innerText = 'Temperature';

  showElement(displayFromToMode, 'block');
  changeListValues(temperature);
  firstUnitText.textContent = '0';
  secondUnitText.textContent = '0';
  secondUnitText.style.fontWeight = '400';

  showElement(numpad, 'grid');
  displayModeSmallest();

  hideModeSelection();
})

selectAreaMode.addEventListener('click', () => {
  alert('То на новий рік');
  // topBarTitle.innerText = 'Area';
  // hideModeSelection();
})

selectTimeMode.addEventListener('click', () => {
  alert('То на новий рік');
  // topBarTitle.innerText = 'Time';
  // hideModeSelection();
})

selectPowerMode.addEventListener('click', () => {
  alert('То на новий рік');
  // topBarTitle.innerText = 'Power';
  // hideModeSelection();
})

selectDataMode.addEventListener('click', () => {
  alert('То на новий рік');
  // topBarTitle.innerText = 'Data';
  // hideModeSelection();
})

// standart and sciensific calculator

let expressionToCalc = '';
let isLastOperationWasOperator = false;
let isLastOperationWasPercentage = false;
let isLastOperationWasPower = false;
let isLastOperationWasMathExpression = false;
let isLastOperationWasEqual = false;
let lastMathExpressionLength = 0;
let lastMathExpressionToCalcLength = 0;
let lastMathEndPointLength = 0;
let leftBracketsNum = 0;
let rightBracketsNum = 0;
let searchBracketsFrom = 0;
let searchBracketsToCalcFrom = 0;

numpad.addEventListener('click', (event) => {
  if (isLastOperationWasEqual) {
    expression.textContent = '';
    isLastOperationWasEqual = false;
  } 

  let currentResultText = result.textContent;
  let currentExpressionText = expression.textContent;
  const lastOperator = currentExpressionText.charAt(currentExpressionText.length - 2);
  
  // clear
  if (event.target.closest('.button-clear')) {
    if (isCurrentFromToMode) {
      lastUnit.textContent = '0';

      convertTemperature(lastUnit);
      setFittedFontSize(firstUnitText, resultFontSize);
      setFittedFontSize(secondUnitText, resultFontSize);
    } else {
      expression.textContent = '';
      result.textContent = '0';
      expressionToCalc = '';
      lastMathExpressionLength = 0;
      lastMathExpressionToCalcLength = 0;
      lastMathEndPointLength = 0;
      leftBracketsNum = 0;
      rightBracketsNum = 0;
      searchBracketsFrom = 0;
      searchBracketsToCalcFrom = 0;
      setFittedFontSize(result, resultFontSize);
    }
  }
  
  // delete
  if (event.target.closest('.button-delete')) {
    if (isCurrentFromToMode) {
      const textLength = lastUnit.textContent.length;

      if (textLength === 1) {
        lastUnit.textContent = '0';
      } else {
        lastUnit.textContent = lastUnit.textContent.slice(0, textLength - 1);
      }

      convertTemperature(lastUnit);
      setFittedFontSize(firstUnitText, resultFontSize);
      setFittedFontSize(secondUnitText, resultFontSize);
    } else {
      if (currentResultText) {
        const textLength = currentResultText.length;

        if (textLength === 1) {
          result.textContent = '0';
        } else {
          result.textContent = currentResultText.slice(0, textLength - 1);
        }
        setFittedFontSize(result, resultFontSize);
      }
    }
  } 
  
  // entering expressions
  if (event.target.closest('.button-number')) {
    const symbol = event.target.textContent;

    if (isCurrentFromToMode) {
      if (lastUnit.textContent === '0' || isNewUnit) {
        isNewUnit = false;
        lastUnit.textContent = symbol;
      } else {
        lastUnit.textContent += symbol;
      }

      convertTemperature(lastUnit);
      setFittedFontSize(firstUnitText, resultFontSize);
      setFittedFontSize(secondUnitText, resultFontSize);
    } else {
      if (currentResultText === '0' || currentResultText === ' ') {
        result.textContent = symbol;
      } else {
        result.textContent += symbol;
      }

      setFittedFontSize(result, resultFontSize);
    }
  }

  // switch value to negative
  if (event.target.closest('.button-switchToNegative')) {
    if (isCurrentFromToMode) {
      if (lastUnit.textContent.startsWith('-')) {
        lastUnit.textContent = lastUnit.textContent.slice(1);
      } else {
        lastUnit.textContent = '-' + lastUnit.textContent;
      }

      convertTemperature(lastUnit);
      setFittedFontSize(firstUnitText, resultFontSize);
      setFittedFontSize(secondUnitText, resultFontSize);
    } else {
      if (currentResultText.startsWith('-')) {
        result.textContent = currentResultText.slice(1);
      } else {
        result.textContent = '-' + currentResultText;
      }

      setFittedFontSize(result, resultFontSize);
    }
  }

  // math constants
  if (event.target.closest('.button-const')) {
    if (event.target.textContent === 'e') {
      result.textContent = E;
    } else {
      result.textContent = PI;
    }
    
    setFittedFontSize(result, resultFontSize);
  }
  
  // math expressions
  if (event.target.closest('.button-math-expression')) {
    if (isLastOperationWasPercentage) return;

    let mathExpression = event.target.textContent;
    let mathExpressionToCalc;
    let mathEndPoint = 'Math.';
    let wrap = '';
    const insideBracketsExpToShow = getExpressionInBrackets(currentExpressionText);
    const insideBracketsExpToCalc = getExpressionInBrackets(expressionToCalc);
    const openIndexToCalc = insideBracketsExpToCalc.openIndex;
    const closeIndexToCalc = insideBracketsExpToCalc.closeIndex;
    const openIndexToShow = insideBracketsExpToShow.openIndex;
    const closeIndexToShow = insideBracketsExpToShow.closeIndex;

    switch (mathExpression) {
      case 'log':
        mathExpressionToCalc = mathExpression + '10';
        break;

      case 'ln':
        mathExpressionToCalc = 'log';
        break;

      case 'x⁻¹': 
        mathExpression = mathExpressionToCalc = '1 / ';
        mathEndPoint = '';
        break;

      case '√':
        mathExpressionToCalc = 'sqrt';
        break;

      case '|x|':
        mathExpression = '';
        mathExpressionToCalc = 'abs';
        wrap = '|';
        break;

      default:
        mathExpressionToCalc = mathExpression;
        break;
    }

    if (openIndexToShow !== -1 && closeIndexToShow !== -1) {
      if (isLastOperationWasMathExpression) {
        const safeOpenIndexToCalc = Math.max(0, openIndexToCalc - (lastMathExpressionToCalcLength + lastMathEndPointLength));
        const safeOpenIndexToShow = Math.max(0, openIndexToShow - lastMathExpressionLength);
        expressionToCalc = expressionToCalc.slice(0, safeOpenIndexToCalc) + `${mathEndPoint}${mathExpressionToCalc}(` + expressionToCalc.slice(safeOpenIndexToCalc) + `)`;
        expression.textContent = currentExpressionText.slice(0, safeOpenIndexToShow) + `${mathExpression}(${wrap}` + currentExpressionText.slice(safeOpenIndexToShow) + `${wrap}) `;
      } else {
        if (isLastOperationWasOperator) {
          expressionToCalc += `${mathEndPoint}${mathExpressionToCalc}(${currentResultText})`;
          expression.textContent += `${mathExpression}(${wrap}${currentResultText}${wrap}) `;
        } else {
          expressionToCalc = expressionToCalc.slice(0, openIndexToCalc) + `${mathEndPoint}${mathExpressionToCalc}` + expressionToCalc.slice(openIndexToCalc);
          expression.textContent = currentExpressionText.slice(0, openIndexToShow) + `${wrap}${mathExpression}${wrap}` + currentExpressionText.slice(openIndexToShow);
        }
      }
    } else {
      expressionToCalc += `${mathEndPoint}${mathExpressionToCalc}(${currentResultText})`;
      expression.textContent += `${mathExpression}(${wrap}${currentResultText}${wrap}) `;
    }

    lastMathExpressionLength = mathExpression.length;
    console.log('Last math expression lenght: ' + lastMathExpressionLength);
    lastMathExpressionToCalcLength = mathExpressionToCalc.length;
    lastMathEndPointLength = mathEndPoint.length;

    isLastOperationWasMathExpression = true;
    isLastOperationWasOperator = false;
    isLastOperationWasPercentage = false;
    isLastOperationWasPower = false;
    result.textContent = '0';

    console.log(expression.textContent, expressionToCalc, openIndexToShow, closeIndexToShow, openIndexToCalc, closeIndexToCalc);
    leftBracketsNum ++;
    rightBracketsNum ++;
    setFittedFontSize(expression, expressionFontSize);
  }

  // brackets
  if (event.target.closest('.button-brackets')) {
    if (event.target.textContent === '(') {
      if (isLastOperationWasMathExpression || isLastOperationWasPercentage) {
        expression.textContent += ' × ( ';
        expressionToCalc += '*(';
      } else {
        expression.textContent += ' ( ';
        expressionToCalc += '(';
      }

      leftBracketsNum ++;
    } else {
      if (leftBracketsNum > rightBracketsNum) {
        if (currentExpressionText.charAt(currentExpressionText.length - 2) === ')') {
          expression.textContent += ' ) ';
          expressionToCalc += ')';
        } else {
          expression.textContent += currentResultText + ' ) ';
          expressionToCalc += currentResultText + ')';
        }

        rightBracketsNum ++;
      }
    }
    isLastOperationWasOperator = false;
    setFittedFontSize(result, resultFontSize);
  }

  // decimal dot
  if (event.target.closest('.button-decimal')) {
    if (isCurrentFromToMode) {
      if (!lastUnit.textContent.includes('.')) {
        lastUnit.textContent += '.';
      }
    } else {
      if (!result.textContent.includes('.')) {
        if (currentResultText.charAt(currentResultText.length - 1) === ' ') {
          result.textContent += '0.';
        } else {
          result.textContent += '.';
        }
        setFittedFontSize(result, resultFontSize);
      }
    }
  }
  
  // operators
  if (event.target.closest('.button-operator')) {
    let operator = '';
    let symbol = event.target.textContent;
    const lastOperator = currentExpressionText.charAt(currentExpressionText.length - 2);

    if (lastOperator !== ')') {
      expressionToCalc += currentResultText;
    }
    
    let isCurrentOperationIsPercentage = false;
    isLastOperationWasPower = false;

    switch(symbol) {
      case '÷':
        operator = '/';
        break;

      case '×':
        operator = '*';
        break;

      case '%':
        console.log(lastOperator);
        if (isLastOperationWasMathExpression || isLastOperationWasPercentage || lastOperator === ')' || lastOperator === '=') return;
        isCurrentOperationIsPercentage = true;
        operator = '';

        const insideBracketsExp = getExpressionInBrackets(expressionToCalc);
        const openIndex = insideBracketsExp.openIndex;
        const closeIndex = insideBracketsExp.closeIndex;
        const insideBrackets = insideBracketsExp.insideBrackets;
        const numArray = insideBracketsExp.numArray;
        const arrayLength = numArray.length;

        if (arrayLength < 2) {
          operator = 0;
        } else if (openIndex !== -1 && closeIndex !== -1) {
          const twoSymbolsMathExpression = expressionToCalc.slice(openIndex - 2, openIndex);
          const threeSymbolsMathExpression = expressionToCalc.slice(openIndex - 3, openIndex);
          const threeSymbolsMathExpressions = ['sin', 'cos', 'tan', 'log'];

          let mathExpression = '';

          if (twoSymbolsMathExpression === 'ln') {
            mathExpression = twoSymbolsMathExpression;
            operator = eval(eval(`Math.${mathExpression}( + ${insideBrackets})`) * numArray[arrayLength-1] / 100);
          } else if (threeSymbolsMathExpressions.includes(threeSymbolsMathExpression)) {
            mathExpression = threeSymbolsMathExpression;
            operator = eval(eval(`Math.${mathExpression}( + ${insideBrackets})`) * numArray[arrayLength-1] / 100);
          } else {
            operator = eval(eval(insideBrackets) * numArray[arrayLength-1] / 100);
          }
        } else {
          operator = eval(numArray[arrayLength-2] * numArray[arrayLength-1] / 100);
        }

        symbol = operator;
        expressionToCalc = expressionToCalc.replace(numArray[arrayLength-1], operator);
        break;

      case 'x²':
        operator = '** 2';
        symbol = '^ 2';
        isLastOperationWasPower = true;
        break;

      case 'xʸ':
        operator = '**';
        symbol = '^';
        break;

      default:
        operator = symbol;
        break;
    }

    if (lastOperator === ')') {
      expressionToCalc += ' ' + operator + ' ';
      expression.textContent += ' ' + symbol + ' ';
    } else if (lastOperator === '=') {
      expressionToCalc = currentResultText + ' ' + operator + ' ';
      expression.textContent = currentResultText + ' ' + symbol + ' ';
    } else if (parseFloat(symbol) || symbol === '0') {
      expression.textContent += symbol;
    } else if (isLastOperationWasPercentage && lastOperator !== '(') {
      expressionToCalc += ' ' + operator + ' ';
      expression.textContent += ' ' + symbol + ' ';
    } else {
      expressionToCalc += ' ' + operator + ' ';
      expression.textContent += currentResultText + ' ' + symbol + ' ';
    }

    isLastOperationWasOperator = true;
    isCurrentOperationIsPercentage ? isLastOperationWasPercentage = true : isLastOperationWasPercentage = false;
    isLastOperationWasMathExpression = false;

    setFittedFontSize(expression, expressionFontSize);
    result.textContent = '0';
    setFittedFontSize(result, resultFontSize);
  } 
  
  // calculate
  if (event.target.closest('.button-equals')) {
    const lastOperator = currentExpressionText.charAt(currentExpressionText.length - 2);
    if (lastOperator !== '=') {
      
      if (!isLastOperationWasPercentage && lastOperator !== ')' && !isLastOperationWasPower) {
        expressionToCalc += currentResultText;
        expression.textContent += currentResultText;
      }

      while (leftBracketsNum > rightBracketsNum) {
        expressionToCalc += ')';
        if (leftBracketsNum === rightBracketsNum + 1) {
          expression.textContent += ' )';
        } else {
          expression.textContent += ' ) ';
        }
        rightBracketsNum++;
      }
      
      expression.textContent += ' = ';

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
      expressionToCalc = '';
      isLastOperationWasEqual = true;
      console.log(expressionToCalc);
      lastMathExpressionLength = 0;
      lastMathExpressionToCalcLength = 0;
      leftBracketsNum = 0;
      rightBracketsNum = 0;
      searchBracketsFrom = 0;
      searchBracketsToCalcFrom = 0;
      isLastOperationWasMathExpression = false;
      isLastOperationWasOperator = false;
      isLastOperationWasPower = false;
      isLastOperationWasPercentage = false;
      console.log(currentExpressionText);
      console.log(expressionToCalc);
    }
  }
});


// from to calculator

let lastUnit = firstUnitText;
let isNewUnit = true;

function changeListValues(listName) {
  firstSelectionList.innerHTML = '';
  secondSelectionList.innerHTML = '';

  listName.forEach(element => {
    let newElement1 = document.createElement('option');
    newElement1.value = element;
    newElement1.textContent = element;

    let newElement2 = document.createElement('option');
    newElement2.value = element;
    newElement2.textContent = element;

    firstSelectionList.appendChild(newElement1);
    secondSelectionList.appendChild(newElement2);
  });
}

firstUnitText.addEventListener('click', () => {
  lastUnit = firstUnitText;
  isNewUnit = true;
  firstUnitText.style.fontWeight = '700';
  secondUnitText.style.fontWeight = '400';
})

secondUnitText.addEventListener('click', () => {
  lastUnit = secondUnitText;
  isNewUnit = true;
  secondUnitText.style.fontWeight = '700';
  firstUnitText.style.fontWeight = '400';
})

// temperature
// const temperature = ['Celsius', 'Fahrenheit', 'Kelvin'];

firstSelectionList.addEventListener('change', () => {
  convertTemperature(lastUnit);
  setFittedFontSize(secondUnitText, resultFontSize);
})

secondSelectionList.addEventListener('change', () => {
  convertTemperature(lastUnit);
  setFittedFontSize(firstUnitText, resultFontSize);
})

function convertTemperature(unit) {
  let from;
  let to;

  if (unit === firstUnitText) {
    from = firstSelectionList;
    to = secondSelectionList;
  } else {
    from = secondSelectionList;
    to = firstSelectionList;
  }

  const fromOption = from.value;
  const toOption = to.value;
  const fromValue = parseFloat(lastUnit.textContent);
  let result;

  switch (fromOption) {
    case 'Celsius':
      if (toOption === 'Fahrenheit') {
        result = fromValue * 9 / 5 + 32;
      } else if (toOption === 'Kelvin') {
        result = fromValue + 273.15;
      } else {
        result = fromValue;
      }
      break;

    case 'Fahrenheit':
      if (toOption === 'Celsius') {
        result = (fromValue - 32) * 5 / 9;
      } else if (toOption === 'Kelvin') {
        result = (fromValue - 32) * 5 / 9 + 273.15;
      } else {
        result = fromValue;
      }
      break;

    case 'Kelvin':
      if (toOption === 'Fahrenheit') {
        result = (fromValue - 273.15) * 9 / 5 + 32;
      } else if (toOption === 'Celsius') {
        result = fromValue - 273.15;
      } else {
        result = fromValue;
      }
      break;

    default:
      result = fromValue;
      break;
  }

  if (unit === firstUnitText) {
    secondUnitText.textContent = result;
  } else {
    firstUnitText.textContent = result;
  }
}