// Enhanced Matching Card Game - JavaScript Implementation
// Phases 1-3: LED Timer, Progress Collection, Advanced Visual Effects
// Developed by Team: Vision, Codi, Wisdom, KC, Zenith

class EnhancedMatchingCardGame {
    constructor() {
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            isComplete: false,
            startTime: null,
            elapsedTime: 0,
            matchedPairs: 0,
            flippedCards: [],
            canFlip: true
        };
        
        this.cards = [];
        this.timerInterval = null;
        this.patterns = 8; // 8 unique patterns for 16 cards (8 pairs)
        this.lastMilestone = 0; // Track milestones for celebrations
        
        // Randomly selected airline images (8 out of 19 available)
        this.airlineImages = [
            'Singapore Airlines.png',
            'JapanAirlines.jpg', 
            'KoreanAir.jpg',
            'MalaysiaAirlines.png',
            'ThaiAirways.png',
            'AirAsia.png',
            'EVAAir.png',
            'VietnamAirlines.jpg'
        ];
        
        this.initializeGame();
        this.bindEvents();
    }

    // Initialize game components
    initializeGame() {
        this.createCardDeck();
        this.renderCards();
        this.updateDisplay();
        this.loadLeaderboard();
        this.initializeProgressRing();
    }

    // Initialize SVG progress ring
    initializeProgressRing() {
        const progressRing = document.getElementById('progressRingFill');
        if (progressRing) {
            progressRing.style.strokeDashoffset = '628.32'; // Full circle
        }
    }

    // Create deck of 16 cards (8 pairs)
    createCardDeck() {
        this.cards = [];
        
        // Create pairs of cards
        for (let i = 1; i <= this.patterns; i++) {
            // Add two cards of each pattern
            this.cards.push({ id: `card-${i}-1`, pattern: i, isFlipped: false, isMatched: false });
            this.cards.push({ id: `card-${i}-2`, pattern: i, isFlipped: false, isMatched: false });
        }
        
        // Shuffle cards using Fisher-Yates algorithm
        this.shuffleCards();
    }

    // Fisher-Yates shuffle algorithm
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Render cards in the game board
    renderCards() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            gameBoard.appendChild(cardElement);
        });
    }

    // Create individual card element
    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.index = index;
        cardDiv.dataset.pattern = card.pattern;

        cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-back card-face">
                    <img src="image/Beginning.png" alt="ChaiMiLES" class="card-back-image"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'card-back-fallback\\'>🎮</div>';">
                </div>
                <div class="card-front card-face">
                    <div class="airline-logo">
                        <img src="image/${this.airlineImages[card.pattern - 1]}" 
                             alt="Airline ${card.pattern}" 
                             loading="lazy"
                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'airline-fallback\\'>✈️</div>';">
                    </div>
                </div>
            </div>
        `;

        cardDiv.addEventListener('click', () => this.handleCardClick(index));
        return cardDiv;
    }

    // Handle card click events
    handleCardClick(index) {
        if (!this.gameState.canFlip || !this.gameState.isPlaying) return;
        
        const card = this.cards[index];
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        
        // Prevent clicking already flipped or matched cards
        if (card.isFlipped || card.isMatched) return;
        
        // Start timer on first card flip
        if (!this.gameState.startTime) {
            this.startTimer();
        }

        // Flip the card
        this.flipCard(index);
        
        // Check for matches if two cards are flipped
        if (this.gameState.flippedCards.length === 2) {
            this.gameState.canFlip = false;
            setTimeout(() => this.checkForMatch(), 300);
        }
    }

    // Flip a card
    flipCard(index) {
        const card = this.cards[index];
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        
        card.isFlipped = true;
        cardElement.classList.add('flipped');
        this.gameState.flippedCards.push(index);
    }

    // Check if two flipped cards match
    checkForMatch() {
        const [firstIndex, secondIndex] = this.gameState.flippedCards;
        const firstCard = this.cards[firstIndex];
        const secondCard = this.cards[secondIndex];
        
        if (firstCard.pattern === secondCard.pattern) {
            // Cards match!
            this.handleMatch(firstIndex, secondIndex);
        } else {
            // Cards don't match
            this.handleMismatch(firstIndex, secondIndex);
        }
        
        // Reset flipped cards array
        this.gameState.flippedCards = [];
        this.gameState.canFlip = true;
    }

    // Handle matching cards with enhanced effects
    handleMatch(firstIndex, secondIndex) {
        const firstCard = this.cards[firstIndex];
        const secondCard = this.cards[secondIndex];
        const firstElement = document.querySelector(`[data-index="${firstIndex}"]`);
        const secondElement = document.querySelector(`[data-index="${secondIndex}"]`);
        
        // Mark as matched
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        
        // Add matched animation
        firstElement.classList.add('matched', 'match-animation');
        secondElement.classList.add('matched', 'match-animation');
        
        // Update score
        this.gameState.matchedPairs++;
        this.updateDisplay();
        
        // Enhanced effects for pair completion
        this.triggerPairCompletionEffects(firstElement, secondElement);
        
        // Check if game is complete
        if (this.gameState.matchedPairs === this.patterns) {
            setTimeout(() => this.handleGameComplete(), 500);
        }
    }

    // Trigger enhanced effects for pair completion
    triggerPairCompletionEffects(firstElement, secondElement) {
        // Update mini card collection
        this.updateCardCollection();
        
        // Create particle effects
        this.createParticleEffect(firstElement);
        this.createParticleEffect(secondElement);
        
        // Update progress bar
        this.updateProgressBar();
    }

    // Update card collection display
    updateCardCollection() {
        const miniCards = document.querySelectorAll('.mini-card');
        const completedCard = miniCards[this.gameState.matchedPairs - 1];
        
        if (completedCard) {
            completedCard.classList.add('completed');
        }
    }

    // Update progress bar
    updateProgressBar() {
        const progressFill = document.getElementById('progressBarFill');
        const percentage = (this.gameState.matchedPairs / this.patterns) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    // Create particle effect
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }
    }

    // Handle mismatched cards
    handleMismatch(firstIndex, secondIndex) {
        setTimeout(() => {
            const firstCard = this.cards[firstIndex];
            const secondCard = this.cards[secondIndex];
            const firstElement = document.querySelector(`[data-index="${firstIndex}"]`);
            const secondElement = document.querySelector(`[data-index="${secondIndex}"]`);
            
            // Flip cards back
            firstCard.isFlipped = false;
            secondCard.isFlipped = false;
            firstElement.classList.remove('flipped');
            secondElement.classList.remove('flipped');
        }, 1000);
    }

    // Start the enhanced game timer
    startTimer() {
        this.gameState.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.gameState.elapsedTime = Date.now() - this.gameState.startTime;
            this.updateEnhancedTimerDisplay();
            this.updateProgressRing();
            this.checkMilestones();
        }, 10);
    }

    // Stop the game timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Update enhanced timer display with effects
    updateEnhancedTimerDisplay() {
        const minutes = Math.floor(this.gameState.elapsedTime / 60000);
        const seconds = Math.floor((this.gameState.elapsedTime % 60000) / 1000);
        const hundredths = Math.floor((this.gameState.elapsedTime % 1000) / 10);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
        
        const enhancedTimer = document.getElementById('enhancedTimer');
        if (enhancedTimer) {
            enhancedTimer.textContent = formattedTime;
            
            // Color coding based on performance
            const totalSeconds = this.gameState.elapsedTime / 1000;
            if (totalSeconds < 30) {
                enhancedTimer.style.color = '#00ff88'; // Green for fast
            } else if (totalSeconds < 60) {
                enhancedTimer.style.color = '#ffaa00'; // Amber for average
            } else {
                enhancedTimer.style.color = '#ff6b6b'; // Red for slow
            }
        }
        
        // Also update the regular timer for modal compatibility
        const regularTimer = document.getElementById('timer');
        if (regularTimer) {
            regularTimer.textContent = formattedTime;
        }
    }

    // Update SVG progress ring
    updateProgressRing() {
        const progressRing = document.getElementById('progressRingFill');
        if (progressRing && this.gameState.elapsedTime > 0) {
            // Ring fills up over 2 minutes (120 seconds)
            const maxTime = 120000; // 2 minutes in milliseconds
            const progress = Math.min(this.gameState.elapsedTime / maxTime, 1);
            const offset = 628.32 * (1 - progress);
            progressRing.style.strokeDashoffset = offset.toString();
        }
    }

    // Check for milestones and trigger celebrations
    checkMilestones() {
        const seconds = Math.floor(this.gameState.elapsedTime / 1000);
        const milestones = [30, 60, 120]; // 30s, 1min, 2min
        
        milestones.forEach(milestone => {
            if (seconds >= milestone && this.lastMilestone < milestone) {
                this.triggerMilestone();
                this.lastMilestone = milestone;
            }
        });
    }

    // Trigger milestone celebration
    triggerMilestone() {
        const enhancedTimer = document.getElementById('enhancedTimer');
        if (enhancedTimer) {
            enhancedTimer.classList.add('milestone');
            setTimeout(() => {
                enhancedTimer.classList.remove('milestone');
            }, 1000);
        }
    }

    // Update game display
    updateDisplay() {
        const enhancedScore = document.getElementById('enhancedScore');
        if (enhancedScore) {
            enhancedScore.textContent = `${this.gameState.matchedPairs}/${this.patterns}`;
        }
        
        // Also update regular score for compatibility
        const regularScore = document.getElementById('score');
        if (regularScore) {
            regularScore.textContent = `${this.gameState.matchedPairs}/${this.patterns}`;
        }
        
        const gameMessage = document.getElementById('gameMessage');
        if (gameMessage) {
            if (!this.gameState.isPlaying) {
                gameMessage.textContent = 'Click "Start Game" to begin!';
            } else if (this.gameState.matchedPairs === 0) {
                gameMessage.textContent = 'Find matching pairs by clicking cards!';
            } else {
                gameMessage.textContent = `Great! ${this.gameState.matchedPairs} pair(s) found!`;
            }
        }
    }

    // Handle game completion with enhanced effects
    handleGameComplete() {
        this.gameState.isComplete = true;
        this.gameState.isPlaying = false;
        this.stopTimer();
        
        // Add celebration animation
        document.querySelector('.game-board').classList.add('game-complete-animation');
        
        // Show achievement trophy
        this.showAchievementTrophy();
        
        // Show completion modal
        this.showGameCompleteModal();
        
        // Update button label to indicate new game can be started
        document.getElementById('startBtn').textContent = 'New Game';
        
        const gameMessage = document.getElementById('gameMessage');
        if (gameMessage) {
            gameMessage.textContent = 'Congratulations! Game completed!';
        }
    }

    // Show achievement trophy
    showAchievementTrophy() {
        const trophy = document.getElementById('achievementTrophy');
        if (trophy) {
            trophy.classList.add('show');
            setTimeout(() => {
                trophy.classList.remove('show');
            }, 3000);
        }
    }

    // Show game complete modal
    showGameCompleteModal() {
        const modal = document.getElementById('gameCompleteModal');
        const finalTime = document.getElementById('finalTime');
        
        const minutes = Math.floor(this.gameState.elapsedTime / 60000);
        const seconds = Math.floor((this.gameState.elapsedTime % 60000) / 1000);
        const hundredths = Math.floor((this.gameState.elapsedTime % 1000) / 10);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
        
        finalTime.textContent = formattedTime;
        modal.style.display = 'block';
    }

    // Start new game
    startGame() {
        this.resetGame();
        this.gameState.isPlaying = true;
        this.gameState.canFlip = true;
        this.updateDisplay();
        
        document.getElementById('startBtn').textContent = 'Game Started!';
    }

    // Restart current game
    restartGame() {
        this.resetGame();
        if (this.gameState.isPlaying) {
            this.startGame();
        }
    }

    // Reset game state with enhanced UI reset
    resetGame() {
        this.stopTimer();
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            isComplete: false,
            startTime: null,
            elapsedTime: 0,
            matchedPairs: 0,
            flippedCards: [],
            canFlip: true
        };
        
        this.lastMilestone = 0;
        this.createCardDeck();
        this.renderCards();
        this.updateDisplay();
        
        // Reset enhanced UI elements
        this.resetEnhancedUI();
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.querySelector('.game-board').classList.remove('game-complete-animation');
    }

    // Reset enhanced UI elements
    resetEnhancedUI() {
        // Reset timer display
        const enhancedTimer = document.getElementById('enhancedTimer');
        if (enhancedTimer) {
            enhancedTimer.textContent = '00:00:00';
            enhancedTimer.style.color = '#00d4ff';
            enhancedTimer.classList.remove('milestone');
        }
        
        // Reset progress bar
        const progressFill = document.getElementById('progressBarFill');
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        
        // Reset card collection
        const miniCards = document.querySelectorAll('.mini-card');
        miniCards.forEach(card => {
            card.classList.remove('completed');
        });
        
        // Reset progress ring
        const progressRing = document.getElementById('progressRingFill');
        if (progressRing) {
            progressRing.style.strokeDashoffset = '628.32';
        }
        
        // Hide achievement trophy
        const trophy = document.getElementById('achievementTrophy');
        if (trophy) {
            trophy.classList.remove('show');
        }
        
        // Reset regular timer for compatibility
        const regularTimer = document.getElementById('timer');
        if (regularTimer) {
            regularTimer.textContent = '00:00:00';
        }
    }

    // Save player score to leaderboard
    saveScore(playerName) {
        if (!playerName.trim()) {
            alert('Please enter your name!');
            return;
        }

        const score = {
            name: playerName.trim(),
            time: this.gameState.elapsedTime,
            date: new Date().toISOString()
        };

        let leaderboard = this.getLeaderboard();
        leaderboard.push(score);
        
        // Sort by time (ascending - fastest first)
        leaderboard.sort((a, b) => a.time - b.time);
        
        // Keep only top 10
        leaderboard = leaderboard.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('matchingGameLeaderboard', JSON.stringify(leaderboard));
        
        // Close modal and show leaderboard
        document.getElementById('gameCompleteModal').style.display = 'none';
        this.showLeaderboard();
    }

    // Get leaderboard from localStorage
    getLeaderboard() {
        const stored = localStorage.getItem('matchingGameLeaderboard');
        return stored ? JSON.parse(stored) : [];
    }

    // Load and display leaderboard
    loadLeaderboard() {
        const leaderboard = this.getLeaderboard();
        const listElement = document.getElementById('leaderboardList');
        
        if (!listElement) return;
        
        if (leaderboard.length === 0) {
            listElement.innerHTML = '<p style="text-align: center; color: #718096;">No scores yet. Be the first to play!</p>';
            return;
        }

        listElement.innerHTML = leaderboard.map((score, index) => {
            const minutes = Math.floor(score.time / 60000);
            const seconds = Math.floor((score.time % 60000) / 1000);
            const hundredths = Math.floor((score.time % 1000) / 10);
            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
            
            return `
                <div class="leaderboard-entry">
                    <span class="leaderboard-rank">#${index + 1}</span>
                    <span class="leaderboard-name">${score.name}</span>
                    <span class="leaderboard-time">${formattedTime}</span>
                </div>
            `;
        }).join('');
    }

    // Show leaderboard modal
    showLeaderboard() {
        this.loadLeaderboard();
        document.getElementById('leaderboardModal').style.display = 'block';
    }

    // Bind event listeners
    bindEvents() {
        // Game control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showLeaderboard());
        
        // Modal events
        document.getElementById('saveScoreBtn').addEventListener('click', () => {
            const playerName = document.getElementById('playerName').value;
            this.saveScore(playerName);
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            document.getElementById('gameCompleteModal').style.display = 'none';
            this.startGame();
        });
        
        // Close modal events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Enter key support for name input
        const playerNameInput = document.getElementById('playerName');
        if (playerNameInput) {
            playerNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const playerName = e.target.value;
                    this.saveScore(playerName);
                }
            });
        }
    }
}

// Initialize enhanced game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new EnhancedMatchingCardGame();
    
    // Add some developer info to console
    console.log('🎮 Enhanced Matching Card Game');
    console.log('👥 Developed by: Vision, Codi, Wisdom, KC, Zenith');
    console.log('🎯 Features: Enhanced UI, LED Timer, Progress Collection, Visual Effects');
    console.log('⚡ Performance: 60fps animations, advanced visual feedback');
    console.log('🚀 Phases: 1-3 Implementation Complete');
});