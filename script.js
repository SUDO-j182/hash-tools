//DEBOUNCE FUNCTION: delays calling a function untill the user stops typing
function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  //CONVERT ARRAYBUFFER TO HEX STRING
  function bufferToHex(buffer){
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');
  }
  
  //HASHING FUNCTION
  async function generateHash() {
    const inputText = document.getElementById('inputText').value;
    const algorithm = document.getElementById('algorithm').value;
    
    //CONVERT STRING TO Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(inputText);
    try {
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashHex = bufferToHex(hashBuffer);
      document.getElementById('outputHash').value = hashHex;
    } catch (error) {
      document.getElementById('outputHash').value = 'Error: ' + error.message;
    }
  }
  //ATTACH EVENT LISTENER TO THE BUTTON
  document.getElementById('generateBtn').addEventListener('click', generateHash);
  
  //COPY HASH TO THE CLIPBOARD
  document.getElementById('copyBtn').addEventListener('click', () => {
  const output = document.getElementById('outputHash').value;
  if (!output) {
    alert('Nothing to copy, generate a hash.');
    return;
  }
  //USE CLIPBOARD API TO COPY THE TEXT
  navigator.clipboard.writeText(output)
  .then(() => {
    alert('Hash copied to clipboard!');
  })
  .catch(err => {
    alert('Failed to copy: ' + err.message);
  });
  });
  
  //CLEAR INPUT AND OUTPUT FIELDS
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputHash').value = '';
  });
  
  //ATTACHING DEBOUNCE TO THE INPUT FIELD
  const inputField = document.getElementById('inputText');
  inputField.addEventListener('input', debounce(generateHash, 300));



  //HASH COMPARE TOOL
  //SELECT THE INPUT FIELDS BUTTON AND RESULTS AREA
const hash1Input = document.getElementById('hash1');
const hash2Input = document.getElementById('hash2');
const compareBtn = document.getElementById('compareBtn');
const resultDiv = document.getElementById('comparison-result');
const copyHash1Btn = document.getElementById('copyHash1');
const copyHash2Btn = document.getElementById('copyHash2');
const visualizerToggle = document.getElementById('toggleVisualizer');
const byteVisualizer = document.getElementById('byteVisualizer');

//LISTEN FOR CLICK ON THE COMPARE BUTTON
compareBtn.addEventListener('click', () => {
  
//GET AND NORMALIZE THE INPUT VALUES
const hash1 = hash1Input.value.trim().toLowerCase();
const hash2 = hash2Input.value.trim().toLowerCase();

//CLEAR ANY PREVIOUS RESULT
resultDiv.textContent = '';
resultDiv.className = '';

//COMPARE THE HASHES 
if (hash1 === '' || hash2 === '') {
  resultDiv.textContent = "Both fields must be filled.";
  resultDiv.classList.add('warning');
} else if (hash1 === hash2) {
  resultDiv.textContent = 'Match!';
  resultDiv.classList.add('match');
} else {
  resultDiv.textContent = 'Mismatch!';
  resultDiv.classList.add('mismatch');
}

//BYTE BY BYTE VISUALIZER
if (visualizerToggle.checked) {
  byteVisualizer.innerHTML = '';
  const maxLenght = Math.max(hash1.length, hash2.length);
  for (let i = 0; i < maxLenght; i++) {
    const char1 = hash1[i] || '';
    const char2 = hash2[i] || '';  
    
    const span = document.createElement('span');
    if (char1 === char2) {
      span.textContent = char1;
      span.classList.add('match');
    } else {
      //SHOW ORIGINAL CHAR OR UNDERSCORE IF ONE IS SHORTER
      span.textContent = char2 || '_';
      span.classList.add('mismatch');
    }
    byteVisualizer.appendChild(span);
  }
} else {
  byteVisualizer.innerHTML = ''; 
}

});

//SELECT THE RESET BUTTON
const resetBtn = document.getElementById('resetBtn');

//RESET FUNCTION
resetBtn.addEventListener('click', () => {
  hash1Input.value = '';
  hash2Input.value = '';
  resultDiv.textContent = '';
  resultDiv.className = '';
});

//COPY FUNCTION
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text)
  .then(() => {
    //SHOW FEEDBACK UPON SUCCESS
    button.textContent = 'Copied!'
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 1500);
  })
  .catch(err => {
    //COPY FAIL MESSAGE
    button.textContent = 'Error';
    console.log('Clipboard Error:', err);
  });
}
//CONNECT BUTTON TO INPUT
copyHash1Btn.addEventListener('click', () => {
  copyToClipboard(hash1Input.value, copyHash1Btn);
});
copyHash2Btn.addEventListener('click', () => {
  copyToClipboard(hash2Input.value, copyHash2Btn);
});