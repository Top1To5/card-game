// Matching Card Game - JavaScript Implementation
// Developed by Team: Vision, Codi, Wisdom, KC, Zenith

class MatchingCardGame {
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
        
        // Randomly selected airline images (8 out of 17 available)
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
        
        // Button click sound
        this.buttonClickSound = new Audio('sound/click-button-04.mp3');
        this.buttonClickSound.volume = 0.4;
        
        // Background music
        this.backgroundMusic = new Audio('sound/background-music-fast-feel-banana.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3; // Default 30%
        
        this.initializeGame();
        this.bindEvents();
        this.initializeMusic();
    }

    // Initialize game components
    initializeGame() {
        this.createCardDeck();
        this.renderCards();
        this.updateDisplay();
        this.loadLeaderboard();
    }

    // Play button click sound
    playButtonSound() {
        this.buttonClickSound.currentTime = 0;
        this.buttonClickSound.play().catch(e => {
            // Handle cases where audio autoplay is blocked
            console.log('Audio play blocked:', e);
        });
    }

    // Initialize background music
    initializeMusic() {
        // Start background music when page loads
        this.backgroundMusic.play().catch(e => {
            console.log('Background music autoplay blocked:', e);
            // Show user interaction prompt if needed
            this.showMusicPrompt();
        });
    }

    // Show prompt to start music if autoplay is blocked
    showMusicPrompt() {
        const musicPrompt = document.createElement('div');
        musicPrompt.className = 'music-prompt';
        musicPrompt.innerHTML = `
            <div class="music-prompt-content">
                <p>🎵 Click to enable background music</p>
                <div class="music-choice-buttons">
                    <button id="enableMusicBtn" class="music-choice-btn enable-btn">Enable Music</button>
                    <button id="closeMusicBtn" class="music-choice-btn close-btn">Close Music</button>
                </div>
            </div>
        `;
        document.body.appendChild(musicPrompt);
        
        document.getElementById('enableMusicBtn').addEventListener('click', () => {
            // Enable Music: Play music at 30% volume
            this.backgroundMusic.volume = 0.3;
            this.backgroundMusic.play();
            document.getElementById('volumeSlider').value = 30;
            this.updateVolumeIcon(0.3);
            this.updateMusicToggleIcon();
            document.body.removeChild(musicPrompt);
        });
        
        document.getElementById('closeMusicBtn').addEventListener('click', () => {
            // Close Music: Keep volume at 30% but pause music
            this.backgroundMusic.volume = 0.3;
            this.backgroundMusic.pause();
            document.getElementById('volumeSlider').value = 30;
            this.updateVolumeIcon(0.3);
            this.updateMusicToggleIcon();
            document.body.removeChild(musicPrompt);
        });
    }

    // Control background music volume
    setMusicVolume(volume) {
        this.backgroundMusic.volume = volume;
    }

    // Toggle background music
    toggleMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play();
        } else {
            this.backgroundMusic.pause();
        }
    }

    // Update music toggle icon
    updateMusicToggleIcon() {
        const toggleBtn = document.getElementById('musicToggle');
        if (this.backgroundMusic.paused) {
            toggleBtn.textContent = '🔇';
            toggleBtn.title = 'Play Music';
        } else {
            toggleBtn.textContent = '🎵';
            toggleBtn.title = 'Pause Music';
        }
    }

    // Update volume icon
    updateVolumeIcon(volume) {
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
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

    // Handle matching cards
    handleMatch(firstIndex, secondIndex) {
        const firstCard = this.cards[firstIndex];
        const secondCard = this.cards[secondIndex];
        const firstElement = document.querySelector(`[data-index="${firstIndex}"]`);
        const secondElement = document.querySelector(`[data-index="${secondIndex}"]`);
        
        // Mark as matched
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        
        // Add matched animation with enhanced effects
        firstElement.classList.add('matched', 'match-animation', 'match-celebration');
        secondElement.classList.add('matched', 'match-animation', 'match-celebration');
        
        // Create particle effects for both cards
        this.createParticleEffect(firstElement);
        this.createParticleEffect(secondElement);
        
        // Update score
        this.gameState.matchedPairs++;
        this.updateDisplay();
        
        // Check if game is complete
        if (this.gameState.matchedPairs === this.patterns) {
            setTimeout(() => this.handleGameComplete(), 500);
        }
    }

    // Create particle effect for matched cards
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create 12 particles in a burst pattern
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Calculate direction for each particle
            const angle = (i / 12) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            // Position particle at card center
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            // Add random color variation
            const colors = ['#48bb78', '#38a169', '#68d391', '#9ae6b4'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(particle);
            
            // Remove particle after animation completes
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

    // Start the game timer
    startTimer() {
        this.gameState.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.gameState.elapsedTime = Date.now() - this.gameState.startTime;
            this.updateTimerDisplay();
        }, 10);
    }

    // Stop the game timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Update timer display
    updateTimerDisplay() {
        const minutes = Math.floor(this.gameState.elapsedTime / 60000);
        const seconds = Math.floor((this.gameState.elapsedTime % 60000) / 1000);
        const hundredths = Math.floor((this.gameState.elapsedTime % 1000) / 10);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = formattedTime;
    }

    // Update game display
    updateDisplay() {
        document.getElementById('score').textContent = `${this.gameState.matchedPairs}/${this.patterns}`;
        
        if (!this.gameState.isPlaying) {
            document.getElementById('gameMessage').textContent = 'Click "Start Game" to begin!';
        } else if (this.gameState.matchedPairs === 0) {
            document.getElementById('gameMessage').textContent = 'Find matching pairs by clicking cards!';
        } else {
            document.getElementById('gameMessage').textContent = `Great! ${this.gameState.matchedPairs} pair(s) found!`;
        }
    }

    // Handle game completion
    handleGameComplete() {
        this.gameState.isComplete = true;
        this.gameState.isPlaying = false;
        this.stopTimer();
        
        // Add celebration animation
        document.querySelector('.game-board').classList.add('game-complete-animation');
        
        // Show completion modal
        this.showGameCompleteModal();
        
        // Update button label to indicate new game can be started
        document.getElementById('startBtn').textContent = 'New Game';
        
        document.getElementById('gameMessage').textContent = 'Congratulations! Game completed!';
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
        this.playButtonSound();
        this.resetGame();
        this.gameState.isPlaying = true;
        this.gameState.canFlip = true;
        this.updateDisplay();
        
        document.getElementById('startBtn').textContent = 'Game Started!';
    }

    // Restart current game
    restartGame() {
        this.playButtonSound();
        this.resetGame();
        if (this.gameState.isPlaying) {
            this.startGame();
        }
    }

    // Reset game state
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
        
        this.createCardDeck();
        this.renderCards();
        this.updateDisplay();
        document.getElementById('timer').textContent = '00:00:00';
        document.getElementById('startBtn').textContent = 'Start Game';
        document.querySelector('.game-board').classList.remove('game-complete-animation');
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
        this.playButtonSound();
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
            this.playButtonSound();
            const playerName = document.getElementById('playerName').value;
            this.saveScore(playerName);
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.playButtonSound();
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
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const playerName = e.target.value;
                this.saveScore(playerName);
            }
        });
        
        // Music control events
        document.getElementById('musicToggle').addEventListener('click', () => {
            this.toggleMusic();
            this.updateMusicToggleIcon();
        });
        
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.setMusicVolume(volume);
            this.updateVolumeIcon(volume);
        });
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new MatchingCardGame();
    
    // Add some developer info to console
    console.log('🎮 Matching Card Game');
    console.log('👥 Developed by: Vision, Codi, Wisdom, KC, Zenith');
    console.log('🎯 Features: 8 unique patterns, responsive design, leaderboard, button sounds, background music');
    console.log('🎵 Music: Auto-loop background music with volume control');
    console.log('⚡ Performance: 60fps animations, cross-browser compatibility');
});