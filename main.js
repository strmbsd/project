function showPage(pageId) {
    const backButton = document.querySelector('.back-button');
    
    // Hide all pages except home
    document.querySelectorAll('.page-section:not(#homePage)').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    if (pageId !== 'homePage') {
        document.getElementById(pageId).classList.add('active');
        backButton.classList.add('visible');
    } else {
        backButton.classList.remove('visible');
    }
    
    // Initialize game if showing 2048 page
    if (pageId === '2048Game') {
        newGame();
    } else if (pageId === 'snakeGame') {
        startSnakeGame();
    }

    // Close the dropdown menu after selection
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownToggle = document.getElementById('projectsDropdown');
    if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
    }
}

function showGameOver(won = false, gameType) {
    const modal = document.getElementById('gameOverModal');
    const title = document.getElementById('gameOverTitle');
    const finalScore = document.getElementById('finalScore');
    
    title.textContent = won ? 'You Won!' : 'Game Over!';
    
    // Get the correct score based on game type
    if (gameType === '2048') {
        finalScore.textContent = document.getElementById('score').textContent;
    } else if (gameType === 'snake') {
        finalScore.textContent = document.getElementById('snakeScore').textContent;
    }
    
    modal.style.display = 'flex';
}

function restartGame() {
    document.getElementById('gameOverModal').style.display = 'none';
    if (document.getElementById('2048Game').classList.contains('active')) {
        newGame();
    } else if (document.getElementById('snakeGame').classList.contains('active')) {
        startSnakeGame();
    }
}

// Add this helper function
function isModalVisible() {
    return document.getElementById('gameOverModal').style.display === 'flex';
}