// Utility: debounce to prevent function spam
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Utility: Convert ArrayBuffer to hexadecimal string
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate cryptographic hash
async function generateHash() {
  const input = document.getElementById('inputText').value;
  const algorithm = document.getElementById('algorithm').value;
  const outputField = document.getElementById('outputHash');

  try {
    const encoded = new TextEncoder().encode(input);
    const hash = await crypto.subtle.digest(algorithm, encoded);
    outputField.value = bufferToHex(hash);
  } catch (err) {
    outputField.value = 'Error: ' + err.message;
  }
}

// Clipboard Copy Handler
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text)
    .then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => (button.textContent = 'Copy'), 1500);
    })
    .catch(err => {
      button.textContent = 'Error';
      console.error('Clipboard Error:', err);
    });
}

// DOM Events for Hash Generator
const inputField = document.getElementById('inputText');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

generateBtn.addEventListener('click', generateHash);
copyBtn.addEventListener('click', () => {
  const output = document.getElementById('outputHash').value;
  if (output) {
    copyToClipboard(output, copyBtn);
  } else {
    alert('Nothing to copy, generate a hash.');
  }
});

clearBtn.addEventListener('click', () => {
  document.getElementById('inputText').value = '';
  document.getElementById('outputHash').value = '';
});

inputField.addEventListener('input', debounce(generateHash, 300));

// DOM Elements for Hash Comparison Tool
const hash1Input = document.getElementById('hash1');
const hash2Input = document.getElementById('hash2');
const compareBtn = document.getElementById('compareBtn');
const resultDiv = document.getElementById('comparison-result');
const copyHash1Btn = document.getElementById('copyHash1');
const copyHash2Btn = document.getElementById('copyHash2');
const visualizerToggle = document.getElementById('toggleVisualizer');
const byteVisualizer = document.getElementById('byteVisualizer');
const resetBtn = document.getElementById('resetBtn');

// Compare hashes with optional visual output
compareBtn.addEventListener('click', () => {
  const hash1 = hash1Input.value.trim().toLowerCase();
  const hash2 = hash2Input.value.trim().toLowerCase();

  resultDiv.textContent = '';
  resultDiv.className = '';

  if (!hash1 || !hash2) {
    resultDiv.textContent = 'Both fields must be filled.';
    resultDiv.classList.add('warning');
    return;
  }

  if (hash1 === hash2) {
    resultDiv.textContent = 'Match!';
    resultDiv.classList.add('match');
  } else {
    resultDiv.textContent = 'Mismatch!';
    resultDiv.classList.add('mismatch');
  }

  if (visualizerToggle.checked) {
    byteVisualizer.innerHTML = '';
    const maxLength = Math.max(hash1.length, hash2.length);
    for (let i = 0; i < maxLength; i++) {
      const char1 = hash1[i] || '';
      const char2 = hash2[i] || '';

      const span = document.createElement('span');
      span.textContent = char2 || '_';
      span.classList.add(char1 === char2 ? 'match' : 'mismatch');
      byteVisualizer.appendChild(span);
    }
  } else {
    byteVisualizer.innerHTML = '';
  }
});

// Reset comparison fields
resetBtn.addEventListener('click', () => {
  hash1Input.value = '';
  hash2Input.value = '';
  resultDiv.textContent = '';
  resultDiv.className = '';
});

copyHash1Btn.addEventListener('click', () => copyToClipboard(hash1Input.value, copyHash1Btn));
copyHash2Btn.addEventListener('click', () => copyToClipboard(hash2Input.value, copyHash2Btn));