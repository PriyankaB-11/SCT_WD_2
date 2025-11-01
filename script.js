
document.addEventListener('DOMContentLoaded', () => {

   
    const displayElement = document.getElementById('display');
    const buttonGrid = document.getElementById('button-grid');

   
    let currentExpression = '0';
    let justEvaluated = false;



  
    const clear = () => {
        currentExpression = '0';
        justEvaluated = false;
    };

   
    const deleteLast = () => {
        // If we just evaluated, clear everything
        if (justEvaluated) {
            clear();
            return;
        }
        
      
        currentExpression = currentExpression.toString().slice(0, -1);
        
        
        if (currentExpression === '') {
            currentExpression = '0';
        }
    };

    const appendNumber = (number) => {
        if (justEvaluated || currentExpression === 'Error') {
            currentExpression = number;
            justEvaluated = false;
        } else if (currentExpression === '0' && number !== '.') {
         
            currentExpression = number;
        } else {
            
            const parts = currentExpression.split(/[-+*/]/);
            const lastPart = parts[parts.length - 1];
            if (number === '.' && lastPart.includes('.')) return;
            
        
            currentExpression += number;
        }
    };

    
    const appendOperator = (operator) => {
        if (currentExpression === 'Error') return;

        justEvaluated = false;
        
        const lastChar = currentExpression.slice(-1);
        
        
        if (['+', '-', '*', '/'].includes(lastChar)) {
           
            currentExpression = currentExpression.slice(0, -1) + operator;
        } else {
            // Add the operator
            currentExpression += operator;
        }
    };

   
    const compute = () => {
        if (justEvaluated || currentExpression === 'Error') return;

        try {
            
            let expressionToEvaluate = currentExpression
                .replace(/[^0-9.+\-*/()]/g, ''); 
        
            if (!expressionToEvaluate || isNaN(expressionToEvaluate[expressionToEvaluate.length - 1])) {
                 if(isNaN(expressionToEvaluate[expressionToEvaluate.length - 1])) {
                    expressionToEvaluate = expressionToEvaluate.slice(0,-1);
                 } else {
                    throw new Error("Invalid expression");
                 }
            }

            const result = new Function('return ' + expressionToEvaluate)();

            // Handle invalid results like 1/0 (Infinity)
            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Invalid result");
            }
            
           
            const roundedResult = Math.round(result * 1000000000) / 1000000000;
            
            currentExpression = roundedResult.toString();
            justEvaluated = true; // Set flag
            
        } catch (error) {
            console.error("Calculation Error:", error);
            currentExpression = 'Error';
            justEvaluated = false;
        }
    };

   
    const updateDisplay = () => {
        
        if (currentExpression.length > 12) {
            displayElement.innerText = currentExpression.substring(0, 12) + "...";
        } else {
            displayElement.innerText = currentExpression;
        }
        
        if (currentExpression.length > 9) {
            displayElement.style.fontSize = '2.5rem';
        } else {
            displayElement.style.fontSize = '3.5rem';
        }
    };


   
    buttonGrid.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return; // Exit if the click wasn't on a button

        
        const { action, number, operator } = button.dataset;

        if (number) {
            appendNumber(number);
        }
        if (operator) {
            appendOperator(operator);
        }
        if (action === 'clear') {
            clear();
        }
        if (action === 'delete') {
            deleteLast();
        }
        if (action === 'evaluate') {
            compute();
        }

        updateDisplay();
    });

   
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Prevent default browser actions for keys we use
        if (['/', '*', 'Enter', ' '].includes(key)) {
            event.preventDefault();
        }

        if (key >= '0' && key <= '9') {
            appendNumber(key);
        }
        if (key === '.') {
            appendNumber(key);
        }
        if (key === '=' || key === 'Enter') {
            compute();
        }
        if (key === 'Backspace') {
            deleteLast();
        }
        if (key === 'Escape') {
            clear();
        }
        if (['+', '-', '*', '/'].includes(key)) {
            appendOperator(key);
        }

        updateDisplay();
    });
    

    updateDisplay(); 
});
