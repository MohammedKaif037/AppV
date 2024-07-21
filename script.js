document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var code = document.getElementById('code').value;
    var inputLabel = '';

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

document.getElementById('executeWithInput').addEventListener('click', function() {
    executeCode();
});

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