let grid = [];
let score = 0;

function newGame() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    document.getElementById('score').textContent = score;
    addNewTile();
    addNewTile();
    updateDisplay();
}

function addNewTile() {
    let available = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                available.push({x: i, y: j});
            }
        }
    }
    if (available.length > 0) {
        let randomCell = available[Math.floor(Math.random() * available.length)];
        grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateDisplay() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = grid[i][j] || '';
            if (grid[i][j]) {
                cell.style.backgroundColor = getColor(grid[i][j]);
            }
            gameGrid.appendChild(cell);
        }
    }
}

function getColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#444';
}

function handleInput(e) {
    if (!document.getElementById('2048Game').classList.contains('active') || isModalVisible()) return;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    
    let moved = false;
    switch(e.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }

    if (moved) {
        addNewTile();
        updateDisplay();
        document.getElementById('score').textContent = score;
        
        if (isGameOver()) {
            // Game over handled by modal
        }
    }
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        let newRow = row.concat(Array(4 - row.length).fill(0));
        if (newRow.join(',') !== grid[i].join(',')) moved = true;
        grid[i] = newRow;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j - 1, 1);
                moved = true;
            }
        }
        let newRow = Array(4 - row.length).fill(0).concat(row);
        if (newRow.join(',') !== grid[i].join(',')) moved = true;
        grid[i] = newRow;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]].filter(x => x !== 0);
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i + 1, 1);
                moved = true;
            }
        }
        let newColumn = column.concat(Array(4 - column.length).fill(0));
        if (newColumn.join(',') !== [grid[0][j], grid[1][j], grid[2][j], grid[3][j]].join(',')) moved = true;
        for (let i = 0; i < 4; i++) {
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]].filter(x => x !== 0);
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i - 1, 1);
                moved = true;
            }
        }
        let newColumn = Array(4 - column.length).fill(0).concat(column);
        if (newColumn.join(',') !== [grid[0][j], grid[1][j], grid[2][j], grid[3][j]].join(',')) moved = true;
        for (let i = 0; i < 4; i++) {
            grid[i][j] = newColumn[i];
        }
    }
    return moved;
}

function isGameOver() {
    // Check for 2048 tile (win condition)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 2048) {
                showGameOver(true, '2048');
                return true;
            }
        }
    }
    
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    
    showGameOver(false, '2048');
    return true;
}

function moveTileToGrid(tile, row, col, tileSize = 100) {
    let newX = col * tileSize;
    let newY = row * tileSize;
    moveTile(tile, newX, newY);
}

document.addEventListener('keydown', handleInput); 