let lockedColors = Array(5).fill(false); // Track locked colors
let lockedHexCodes = Array(5).fill(null); // Store hex codes for locked colors

function generatePalette() {
    const colorGrid = document.getElementById('colorGrid');
    colorGrid.innerHTML = ''; // Clear the grid

    for (let i = 0; i < 5; i++) {
        // Create a container for the color box and hex code
        const colorContainer = document.createElement('div');
        colorContainer.className = 'color-container';

        // Create the color box
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';

        // If the color is locked, use the stored hex code; otherwise, generate a new one
        const hexCode = lockedColors[i] ? lockedHexCodes[i] : getRandomHexCode();
        colorBox.style.backgroundColor = hexCode;
        colorBox.dataset.hex = hexCode;

        // Store the hex code if the color is locked
        if (lockedColors[i]) {
            lockedHexCodes[i] = hexCode;
        }

        // Color actions (lock and copy)
        const colorActions = document.createElement('div');
        colorActions.className = 'color-actions';

        // Lock button
        const lockButton = document.createElement('button');
        lockButton.innerHTML = `<i class="bi ${lockedColors[i] ? 'bi-lock-fill' : 'bi-unlock'}"></i>`;
        lockButton.onclick = () => toggleLock(i, lockButton, hexCode);
        colorActions.appendChild(lockButton);

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="bi bi-clipboard"></i>';
        copyButton.onclick = () => copyToClipboard(hexCode);
        colorActions.appendChild(copyButton);

        // Add color actions to the color box
        colorBox.appendChild(colorActions);

        // Create the hex code display
        const hexDisplay = document.createElement('div');
        hexDisplay.className = 'color-hex';
        hexDisplay.textContent = hexCode;
        hexDisplay.onclick = () => copyToClipboard(hexCode);

        // Add the color box and hex code to the container
        colorContainer.appendChild(colorBox);
        colorContainer.appendChild(hexDisplay);

        // Add the container to the grid
        colorGrid.appendChild(colorContainer);
    }
}

function getRandomHexCode() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function toggleLock(index, button, hexCode) {
    lockedColors[index] = !lockedColors[index];
    lockedHexCodes[index] = lockedColors[index] ? hexCode : null; // Store or clear the hex code
    button.innerHTML = `<i class="bi ${lockedColors[index] ? 'bi-lock-fill' : 'bi-unlock'}"></i>`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copied: ${text}`);
    }).catch(() => {
        alert('Failed to copy text.');
    });
}

// Generate the initial palette on page load
document.addEventListener('DOMContentLoaded', generatePalette);