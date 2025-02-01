let snake = [];
let food = { x: 0, y: 0 };
let direction = 'right';
let nextDirection = 'right';
let snakeScore = 0;
let gameInterval;
let gameStarted = false;

function startSnakeGame() {
    if (gameInterval) clearInterval(gameInterval);
    
    const container = document.getElementById('snakeContainer');
    container.innerHTML = '';
    
    // Calculate center position for snake start
    const gridSize = 20;
    const centerX = Math.floor(container.clientWidth / (2 * gridSize)) * gridSize;
    const centerY = Math.floor(container.clientHeight / (2 * gridSize)) * gridSize;
    
    snake = [
        { x: centerX, y: centerY },
        { x: centerX - gridSize, y: centerY },
        { x: centerX - (2 * gridSize), y: centerY }
    ];
    
    direction = 'right';
    nextDirection = 'right';
    snakeScore = 0;
    document.getElementById('snakeScore').textContent = snakeScore;
    
    createFood();
    drawSnake();
    gameStarted = false;
}

function createFood() {
    const container = document.getElementById('snakeContainer');
    const gridSize = 20;
    const maxX = Math.floor(container.clientWidth / gridSize) * gridSize - gridSize;
    const maxY = Math.floor(container.clientHeight / gridSize) * gridSize - gridSize;
    
    // Remove existing food
    const existingFood = container.querySelector('.snake-food');
    if (existingFood) existingFood.remove();
    
    // Keep generating new positions until we find one not occupied by the snake
    do {
        food.x = Math.floor(Math.random() * (maxX / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (maxY / gridSize)) * gridSize;
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    
    const foodElement = document.createElement('div');
    foodElement.className = 'snake-food';
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    container.appendChild(foodElement);
}

function drawSnake() {
    const container = document.getElementById('snakeContainer');
    
    // Remove existing snake segments
    container.querySelectorAll('.snake-segment').forEach(segment => segment.remove());
    
    // Create new snake segments
    snake.forEach((segment, index) => {
        const segmentElement = document.createElement('div');
        segmentElement.className = 'snake-segment';
        segmentElement.style.left = segment.x + 'px';
        segmentElement.style.top = segment.y + 'px';
        
        // Add rotation based on direction
        if (index > 0) {
            const prevSegment = snake[index - 1];
            const nextSegment = snake[index + 1];
            
            if (prevSegment && nextSegment) {
                // Calculate angle for curved segments
                const angle = Math.atan2(
                    nextSegment.y - prevSegment.y,
                    nextSegment.x - prevSegment.x
                ) * 180 / Math.PI;
                segmentElement.style.transform = `rotate(${angle}deg)`;
            }
        }
        
        container.appendChild(segmentElement);
    });
}

function moveSnake() {
    direction = nextDirection;
    
    // Calculate new head position
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y -= 20; break;
        case 'down': head.y += 20; break;
        case 'left': head.x -= 20; break;
        case 'right': head.x += 20; break;
    }
    
    // Check for collisions
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if food was eaten
    if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        document.getElementById('snakeScore').textContent = snakeScore;
        createFood();
    } else {
        snake.pop();
    }
    
    drawSnake();
}

function checkCollision(head) {
    const container = document.getElementById('snakeContainer');
    const maxX = container.clientWidth - 20;
    const maxY = container.clientHeight - 20;
    
    // Check wall collision
    if (head.x < 0 || head.x > maxX || head.y < 0 || head.y > maxY) {
        return true;
    }
    
    // Check self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    clearInterval(gameInterval);
    gameStarted = false;
    showGameOver(false, 'snake');
}

// Snake game controls
document.addEventListener('keydown', function(e) {
    if (!document.getElementById('snakeGame').classList.contains('active') || isModalVisible()) return;
    
    if (!gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        gameStarted = true;
        gameInterval = setInterval(moveSnake, 100);
    }
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
    
    // Prevent page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
}); 