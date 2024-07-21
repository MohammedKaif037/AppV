 
# Code Execution with CodeX API

## Overview

This project provides a web-based interface to compile and execute code snippets in different programming languages (Java, Python, C) using the CodeX API. The application allows users to input their code, specify if input is required, and execute the code to see the results. The user interface is designed to handle both simple and complex code snippets, dynamically adjusting based on the language and input requirements.

## Project Structure

- `index.html` - The main HTML file that defines the structure of the web page.
- `style.css` - The CSS file used for styling the web page.
- `script.js` - The JavaScript file that contains the logic for processing and executing the code.

## Features

1. **Language Selection**: Users can select the programming language for their code.
2. **Code Input**: Users can enter their code into a textarea.
3. **Dynamic Input Handling**: Detects if the code requires input based on language-specific input methods (`scanf` for C, `input()` for Python, `Scanner` for Java).
4. **Code Execution**: Sends the code to the CodeX API for execution and displays the output.
5. **Error Handling**: Displays errors if the code execution fails.

## HTML Structure

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Execution with CodeX API</title>
    <link rel="stylesheet" href="style.css"> <!-- Link to the CSS file -->
</head>
<body>
    <div class="container">
        <div class="input-section">
            <h1>Code Compiler</h1>
            <form id="codeForm">
                <label for="language">Select Language:</label>
                <select id="language" name="language" required>
                    <option value="java">Java</option>
                    <option value="py">Python</option>
                    <option value="c">C</option>
                </select>
                <br>
                <label for="code">Enter Code:</label><br>
                <textarea id="code" name="code" rows="10" required></textarea>
                <br>
                <button type="submit">Execute</button>
            </form>
            <div id="inputSection">
                <label id="inputLabel" for="userInput"></label><br>
                <input id="userInput" type="text" placeholder="Enter your input here">
                <br>
                <button id="executeWithInput">Execute with Input</button>
            </div>
        </div>
        <div id="output"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

## JavaScript Logic

### `script.js`

This file contains the logic to handle form submissions, process the code, and interact with the CodeX API.

#### Code Overview

1. **Form Submission Handling**

   - **Event Listener**: Listens for the form submit event.
   - **Prevent Default**: Prevents the default form submission action.
   - **Input Detection**: Determines if the code snippet requires input and extracts the input label if necessary.
   - **Show Input Section**: Displays the input section if input is required, otherwise calls `executeCode()` to run the code.

   ```javascript
   document.getElementById('codeForm').addEventListener('submit', function(event) {
       event.preventDefault();
       var code = document.getElementById('code').value;
       var inputLabel = '';

       // Detects input prompt based on language-specific methods
       if (code.includes('scanf')) {
           var match = code.match(/scanf\("([^"]*)"/);
           if (match) {
               inputLabel = match[1];
           }
       } else if (code.includes('input(')) {
           var match = code.match(/input\("([^"]*)"\)/);
           if (match) {
               inputLabel = match[1];
           }
       } else if (code.includes('Scanner')) {
           var match = code.match(/new Scanner\(System\.in\).next\(\);.*?\("([^"]*)"\)/);
           if (match) {
               inputLabel = match[1];
           }
       }

       if (inputLabel) {
           document.getElementById('inputLabel').textContent = inputLabel;
           document.getElementById('inputSection').classList.add('show');
       } else {
           executeCode();
       }
   });
   ```

2. **Execute with Input Button Handling**

   - **Event Listener**: Listens for the "Execute with Input" button click event.
   - **Call `executeCode()`**: Calls `executeCode()` to process and execute the code.

   ```javascript
   document.getElementById('executeWithInput').addEventListener('click', function() {
       executeCode();
   });
   ```

3. **Code Execution**

   - **Remove Input Prompts**: Cleans up input prompts from the code before sending it for execution.
   - **API Request**: Sends the cleaned code and input (if provided) to the CodeX API.
   - **Display Output**: Displays the output or error message based on the response from the API.

   ```javascript
   function executeCode() {
       var language = document.getElementById('language').value;
       var code = document.getElementById('code').value;
       var userInput = document.getElementById('userInput').value;

       // Remove the input prompt from the code
       if (code.includes('input(')) {
           code = code.replace(/input\("([^"]*)"\)/, 'input()');
       } else if (code.includes('scanf')) {
           code = code.replace(/scanf\("([^"]*)"/, 'scanf("') ;
       } else if (code.includes('Scanner')) {
           code = code.replace(/new Scanner\(System\.in\).next\(\);.*?\("([^"]*)"\)/, 'new Scanner(System.in).next();');
       }

       var data = new URLSearchParams();
       data.append('language', language);
       data.append('code', code);
       if (userInput) {
           data.append('input', userInput);
       }

       fetch('https://api.codex.jaagrav.in', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
           },
           body: data
       })
       .then(response => response.json())
       .then(data => {
           var output = data.output ? data.output.replace(document.getElementById('inputLabel').textContent, '') : data.error;
           document.getElementById('output').innerText = output;
       })
       .catch(error => {
           document.getElementById('output').innerText = 'Error: ' + error;
       });
   }
   ```

## CSS Styling

The `style.css` file should include styles for the following elements:

- `.container`: Container for the main content.
- `.input-section`: Section for the input form and code area.
- `#inputSection`: Input section for handling user input.
- `#output`: Area to display the output or errors.

## Usage

1. **Open the `index.html` file** in a web browser.
2. **Select a programming language** from the dropdown.
3. **Enter your code** into the textarea.
4. **Click "Execute"** to run the code.
5. **If input is required**, enter the input value and click "Execute with Input".

## Dependencies

- CodeX API (https://api.codex.jaagrav.in)

## Notes

- Ensure the CodeX API endpoint is accessible and functional.
- Handle any potential network errors or API issues gracefully.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
