// Selectors
const gridContainer = document.querySelector('.grid-container');
const movesDisplay = document.querySelector('.moves');
const timerDisplay = document.querySelector('.timer');
const startButton = document.querySelector('.btn-game[onclick*="start"]');
const restartButton = document.querySelector('.btn-game[onclick*="restart"]');
const difficultyButtons = document.querySelectorAll('.difficulty .btn-game');

// Game state
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    currentDifficulty: 'easy',
    gameWon: false
};

// Emojis
const emojis = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍋', '🍉', '🍓', '🥑', '🥝', '🍑', '🍍'];

// Initialize difficulty buttons
function initDifficulty() {
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            // Set difficulty
            state.currentDifficulty = this.textContent.toLowerCase();
            console.log('Difficulty set to:', state.currentDifficulty);
            
            // Update grid preview immediately
            updateGridLayout();
            
            // Regenerate cards with new difficulty
            generateCards();
            
            // If game is already running, keep it running but with new difficulty
            if (state.gameStarted && !state.gameWon) {
                // Keep timer running, just reset moves and regenerate cards
                state.flippedCards = 0;
                state.totalFlips = 0;
                
                // Update moves display
                if (movesDisplay) {
                    movesDisplay.textContent = 'Moves: 0';
                }
            }
        });
    });
    
    // Set easy as default active
    difficultyButtons[0].classList.add('active');
}

// Update grid layout based on difficulty
function updateGridLayout() {
    if (state.currentDifficulty === 'hard') {
        // Hard: 6x4 grid (24 cards = 12 pairs)
        gridContainer.style.gridTemplateColumns = 'repeat(6, 140px)';
        gridContainer.style.gridTemplateRows = 'repeat(4, calc(140px / 2 * 3))';
    } else {
        // Easy: 4x3 grid (12 cards = 6 pairs)
        gridContainer.style.gridTemplateColumns = 'repeat(4, 140px)';
        gridContainer.style.gridTemplateRows = 'repeat(3, calc(140px / 2 * 3))';
    }
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate cards
function generateCards() {
    // Clear grid
    gridContainer.innerHTML = '';
    
    // Reset win state
    state.gameWon = false;
    
    // Determine number of pairs based on difficulty
    let pairs;
    if (state.currentDifficulty === 'hard') {
        pairs = 12; // 12 pairs = 24 cards for 6x4 grid
    } else {
        pairs = 6; // 6 pairs = 12 cards for 4x3 grid
    }
    
    // Select emojis (use first X emojis based on pairs needed)
    const selectedEmojis = emojis.slice(0, pairs);
    
    // Create pairs (each emoji twice)
    let cards = [];
    selectedEmojis.forEach(emoji => {
        cards.push(emoji);
        cards.push(emoji);
    });
    
    // Shuffle cards
    cards = shuffleArray(cards);
    
    console.log(`Generating ${cards.length} cards for ${state.currentDifficulty} mode`);
    
    // Create card elements
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        // Card structure matching your CSS
        card.innerHTML = `
            <div class="front">
                <div class="emoji">${emoji}</div>
            </div>
            <div class="back"></div>
        `;
        
        // Add click event - but only if game has started and not won
        if (state.gameStarted && !state.gameWon) {
            card.addEventListener('click', () => flipCard(card));
            card.style.cursor = 'pointer';
        } else {
            // If game hasn't started or is won, show the card backs only
            card.style.cursor = 'default';
        }
        
        gridContainer.appendChild(card);
    });
}

// Check if all cards are matched
function checkWinCondition() {
    const totalCards = document.querySelectorAll('.card').length;
    const matchedCards = document.querySelectorAll('.card.matched').length;
    
    console.log(`Checking win: ${matchedCards}/${totalCards} cards matched`);
    
    // If all cards are matched
    if (matchedCards === totalCards && totalCards > 0) {
        state.gameWon = true;
        console.log('🎉 You won! All cards matched!');
        
        // Stop the timer
        if (state.loop) {
            clearInterval(state.loop);
            console.log('Timer stopped at', state.totalTime, 'seconds');
        }
        
        // Disable all cards
        document.querySelectorAll('.card').forEach(card => {
            card.style.cursor = 'default';
            card.removeEventListener('click', () => flipCard(card));
        });
        
        // Optional: Add visual feedback for win
        gridContainer.style.border = '3px solid #2ecc71';
        gridContainer.style.transition = 'border 0.5s';
        
        // Optional: Show win message in console
        console.log(`Congratulations! You completed the game in ${state.totalTime} seconds with ${state.totalFlips} moves!`);
        
        return true;
    }
    return false;
}

// Flip card function
function flipCard(card) {
    if (!state.gameStarted || 
        state.gameWon ||
        card.classList.contains('flipped') || 
        card.classList.contains('matched') ||
        state.flippedCards >= 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    state.flippedCards++;
    state.totalFlips++;
    
    // Update moves display
    if (movesDisplay) {
        movesDisplay.textContent = `Moves: ${state.totalFlips}`;
    }
    
    // Check for match when two cards are flipped
    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.card.flipped:not(.matched)');
        
        if (flippedCards.length === 2) {
            const card1 = flippedCards[0];
            const card2 = flippedCards[1];
            
            // Check if emojis match
            if (card1.dataset.emoji === card2.dataset.emoji) {
                // Match found
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                // Remove click events from matched cards
                card1.removeEventListener('click', () => flipCard(card1));
                card2.removeEventListener('click', () => flipCard(card2));
                
                // Reset flipped cards count
                setTimeout(() => {
                    state.flippedCards = 0;
                    
                    // Check if player won after this match
                    checkWinCondition();
                }, 500);
            } else {
                // No match - flip back
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    state.flippedCards = 0;
                }, 1000);
            }
        }
    }
}

// Start game function
function start() {
    if (!state.gameStarted) {
        state.gameStarted = true;
        state.gameWon = false; // Reset win state
        console.log('Game started in', state.currentDifficulty, 'mode');
        
        // Remove win border if it exists
        gridContainer.style.border = '';
        
        // Disable start button
        if (startButton) {
            startButton.disabled = true;
            startButton.textContent = 'Game Started';
        }
        
        // Start timer
        state.loop = setInterval(() => {
            state.totalTime++;
            if (timerDisplay) {
                timerDisplay.textContent = `Time: ${state.totalTime}s`;
            }
        }, 1000);
        
        // Add click events to all cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => flipCard(card));
            card.style.cursor = 'pointer';
        });
    }
}

// Restart game function
function restart() {
    console.log('Restarting game...');
    
    // Clear timer
    if (state.loop) {
        clearInterval(state.loop);
    }
    
    // Reset game state
    state.gameStarted = false;
    state.gameWon = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;
    
    // Reset displays
    if (movesDisplay) {
        movesDisplay.textContent = 'Moves: 0';
    }
    if (timerDisplay) {
        timerDisplay.textContent = 'Time: 0';
    }
    
    // Enable start button
    if (startButton) {
        startButton.disabled = false;
        startButton.textContent = 'Start';
    }
    
    // Remove win border
    gridContainer.style.border = '';
    
    // Generate new cards
    generateCards();
}

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game initializing...');
    
    // Initialize difficulty
    initDifficulty();
    
    // Generate initial cards (game not started yet)
    generateCards();
    
    console.log('Ready! You can now:');
    console.log('1. Select Easy (4x3) or Hard (6x4)');
    console.log('2. See the grid change immediately');
    console.log('3. Click Start when ready');
});

// Make functions available globally
window.start = start;
window.restart = restart;