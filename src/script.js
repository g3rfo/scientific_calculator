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

// math
const PI = Math.PI;
const E = Math.E;

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

function resetDisplayValue(element, value) {
  element.textContent = value;
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

  resetDisplayValue(expression, '');
  resetDisplayValue(result, '0');
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
let isLastOperationWasOperator = false;
let isLastOperationWasPercentage = false;
let isLastOperationWasMathExpression = false;
let isLastOperationWasEqual = false;
let lastMathExpressionLength = 0;
let lastMathExpressionToCalcLength = 0;
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
    expression.textContent = '';
    result.textContent = '0';
    expressionToCalc = '';
    lastMathExpressionLength = 0;
    lastMathExpressionToCalcLength = 0;
    leftBracketsNum = 0;
    rightBracketsNum = 0;
    searchBracketsFrom = 0;
    searchBracketsToCalcFrom = 0;
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
  }

  // switch value to negative
  if (event.target.closest('.button-switchToNegative')) {

    if (currentResultText.startsWith('-')) {
      result.textContent = currentResultText.slice(1);
    } else {
      result.textContent = '-' + currentResultText;
    }

    setFittedFontSize(result, resultFontSize);
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

    const mathExpression = event.target.textContent;
    let mathExpressionToCalc;
    const insideBracketsExpToShow = getExpressionInBrackets(currentExpressionText);
    const insideBracketsExpToCalc = getExpressionInBrackets(expressionToCalc);
    const openIndexToCalc = insideBracketsExpToCalc.openIndex;
    const closeIndexToCalc = insideBracketsExpToCalc.closeIndex;
    const openIndexToShow = insideBracketsExpToShow.openIndex;
    const closeIndexToShow = insideBracketsExpToShow.closeIndex;

    console.log('Operator: curExpToShow = ' + currentExpressionText + ' curExpToCalc = ' + expressionToCalc);
    switch (mathExpression) {
      case 'log':
        mathExpressionToCalc = mathExpression + '10';
        break;

      case 'ln':
        mathExpressionToCalc = 'log';
        break;

      default:
        mathExpressionToCalc = mathExpression;
        break;
    }

    if (openIndexToShow !== -1 && closeIndexToShow !== -1) {
      console.log(lastMathExpressionLength.length, 111 - undefined);

      if (isLastOperationWasMathExpression) {
        console.log('Prev operation was math operation');
        expressionToCalc = expressionToCalc.slice(0, openIndexToCalc - (lastMathExpressionToCalcLength + 5)) + `Math.${mathExpressionToCalc}(` + expressionToCalc.slice(openIndexToCalc - (lastMathExpressionToCalcLength + 5)) + ')';
        expression.textContent = currentExpressionText.slice(0, openIndexToShow - lastMathExpressionLength) + `${mathExpression}(` + currentExpressionText.slice(openIndexToShow - lastMathExpressionLength) + ') ';
      } else {
        if (isLastOperationWasOperator) {
          expressionToCalc += `Math.${mathExpressionToCalc}(${currentResultText})`;
          expression.textContent += `${mathExpression}(${currentResultText}) `;
        } else {
          expressionToCalc = expressionToCalc.slice(0, openIndexToCalc) + `Math.${mathExpressionToCalc}` + expressionToCalc.slice(openIndexToCalc);
          expression.textContent = currentExpressionText.slice(0, openIndexToShow) + `${mathExpression}` + currentExpressionText.slice(openIndexToShow);
        }
      }
    } else {
      expressionToCalc += `Math.${mathExpressionToCalc}(${currentResultText})`;
      expression.textContent += `${mathExpression}(${currentResultText}) `;
    }

    lastMathExpressionLength = mathExpression.length;
    lastMathExpressionToCalcLength = mathExpressionToCalc.length;

    isLastOperationWasMathExpression = true;
    isLastOperationWasOperator = false;
    isLastOperationWasPercentage = false;
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
    if (currentResultText.charAt(currentResultText.length - 1) === ' ') {
      result.textContent += '0.';
    } else {
      result.textContent += '.';
    }
    setFittedFontSize(result, resultFontSize);
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

        symbol = String(operator);
        expressionToCalc = expressionToCalc.replace(numArray[arrayLength-1], operator);

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
      
      if (!isLastOperationWasPercentage && lastOperator !== ')') {
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
      isLastOperationWasPercentage = false;
      console.log(currentExpressionText);
      console.log(expressionToCalc);
    }
  }
});

