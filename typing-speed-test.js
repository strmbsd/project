const promptElement = document.getElementById("prompt");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const results = document.getElementById("results");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart-btn");

const prompts = [
    "The quick brown fox jumps over the lazy dog several times in a row, thinking this exercise will keep it sharp and active.",
    "Once upon a time, in a land far away, there was a kingdom where everyone believed in kindness and lived in harmony.",
    "Every person you meet has a story to tell, a lesson to share, and a journey of their own. Remember that.",
    "A journey of a thousand miles begins with a single step, but it also requires courage and determination to complete.",
    "Innovation distinguishes between a leader and a follower, inspiring those around to think outside the box.",
    "Beneath the vast, starry sky, the sound of waves crashing on the shore brought peace to the restless traveler.",
    "Time flies when you're having fun, but it moves even faster when you're deeply engrossed in something meaningful.",
    "A gentle breeze rustled the golden leaves, reminding everyone that autumn had gracefully arrived once more.",
    "The hummingbird flitted from flower to flower, showcasing nature's delicate yet relentless pursuit of sustenance.",
    "Mountains may rise high and rivers may run deep, but the human spirit is capable of conquering even greater heights.",
    "Every great achievement begins as a small idea, nurtured by persistence, patience, and a willingness to learn.",
    "Under the blazing sun, the desert stretched endlessly, its shifting sands whispering secrets of ancient times.",
    "In a world full of noise, a moment of silence can speak volumes to those who take the time to listen.",
    "The inventor worked tirelessly in their tiny workshop, dreaming of a future where their creation would change lives.",
    "Life is like a garden, full of weeds and flowers, and it's up to us to decide which will flourish.",
    "A good book can transport you to worlds unknown, where heroes rise, mysteries unfold, and dreams come alive.",
    "The city lights sparkled like a thousand tiny stars, illuminating the lives of millions bustling below.",
    "Even the darkest night will end, and the sun will rise, bringing hope to those who dare to believe in it.",
    "The orchestra played a symphony so breathtaking that every heart in the audience swelled with emotion.",
    "Through hard work and unwavering faith, ordinary people can achieve extraordinary things beyond their wildest dreams."
];

let timeElapsed = 0; // Time in tenths of a second
let timer;
let started = false;
let currentPrompt = "";
let totalCharsTyped = 0;
let correctChars = 0;
let incorrectChars = 0;
let mistakes = [];

function startTest() {
    if (started) return;
    started = true;

    inputElement.disabled = false;
    inputElement.value = "";
    inputElement.focus();
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    renderPrompt(currentPrompt);
    timeElapsed = 0;
    timerElement.textContent = `Seconds: 0.0`;
    mistakes = Array(currentPrompt.length).fill(false);

    startBtn.style.display = "none"; // Hide start button on test start

    timer = setInterval(() => {
        timeElapsed++;
        const seconds = (timeElapsed / 10).toFixed(1); // Convert to seconds with one decimal place
        timerElement.textContent = `Seconds: ${seconds}`;
    }, 100); // Update every 100ms (tenth of a second)
}

function endTest() {
    clearInterval(timer);
    const wordsTyped = totalCharsTyped / 5;
    const secondsElapsed = timeElapsed / 10; // Convert to seconds
    const wpm = Math.round((wordsTyped / secondsElapsed) * 60);
    const accuracy = correctChars > 0 ? Math.round((correctChars / (correctChars + incorrectChars)) * 100) : 0;

    wpmElement.textContent = wpm;
    accuracyElement.textContent = `${accuracy}%`;

    results.style.display = "block";
    started = false;
}

function renderPrompt(prompt) {
    promptElement.innerHTML = '';
    for (let i = 0; i < prompt.length; i++) {
        const span = document.createElement('span');
        span.textContent = prompt[i];
        promptElement.appendChild(span);
    }
}

function checkInput() {
    const inputText = inputElement.value;
    totalCharsTyped = inputText.length;
    correctChars = 0;

    Array.from(promptElement.children).forEach((charElement, index) => {
        const typedChar = inputText[index];

        if (typedChar == null) {
            charElement.classList.remove('correct', 'incorrect');
        } else if (typedChar === charElement.textContent) {
            charElement.classList.add('correct');
            charElement.classList.remove('incorrect');
            correctChars++;
        } else {
            charElement.classList.add('incorrect');
            charElement.classList.remove('correct');
            // Mark this position as an error if not already marked
            if (!mistakes[index]) {
                incorrectChars++;
                mistakes[index] = true; // Track mistake at this index
            }
        }
    });

    if (inputText === currentPrompt) {
        endTest();
    }
}

function resetTest() {
    clearInterval(timer);
    timerElement.textContent = "Seconds: 0.0";
    inputElement.disabled = true;
    inputElement.value = "";
    results.style.display = "none";
    startBtn.style.display = "inline-block"; // Show start button when resetting
    started = false;
    totalCharsTyped = 0;
    correctChars = 0;
    incorrectChars = 0;
    promptElement.innerHTML = "Press 'Start Test' to begin!";
}

startBtn.addEventListener("click", startTest);
inputElement.addEventListener("input", checkInput);
restartBtn.addEventListener("click", resetTest);

resetTest();  // Initialize the test state when the page loads