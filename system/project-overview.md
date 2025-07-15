# Matching Card Game - Project Overview

## Game Description

A memory-based matching card game where players flip cards to find matching pairs. The game features 8 pairs of cards (16 cards total) that are initially face-down and shuffled randomly.

## Core Features

### Game Mechanics
- **Card Grid**: 16 cards arranged in a 4x4 grid
- **Matching System**: Players flip two cards at a time to find matching pairs
- **Game State**: Cards remain face-up when matched, face-down when not matched
- **Win Condition**: All 8 pairs successfully matched

### Timer System
- **Game Timer**: Tracks elapsed time from first card flip to game completion
- **Display**: Real-time timer showing minutes and seconds
- **Precision**: Timer stops when final pair is matched

### Leaderboard
- **Score Tracking**: Records completion times for fastest finishers
- **Ranking**: Displays top completion times in ascending order
- **Persistence**: Stores leaderboard data locally or in database
- **Display**: Shows player names/initials and completion times

## Technical Requirements

### User Interface
- Responsive card grid layout
- Visual feedback for card flips and matches
- Timer display prominently shown
- Leaderboard accessible from main game screen

### Game Logic
- Card shuffling algorithm for random placement
- Match detection and validation
- Game state management (playing, paused, completed)
- Score calculation and leaderboard updates

## Success Criteria

- Smooth card flipping animations
- Accurate timer functionality
- Persistent leaderboard storage
- Intuitive user experience
- Responsive design for different screen sizes

## Development & Testing Approach

### Testing Strategy
- **Test-First Development**: All new features and changes are implemented in `index-test.html` first
- **Separate Test Environment**: Uses `script-test.js` for isolated testing
- **Visual Test Indicator**: Test version includes prominent banner to distinguish from production
- **Staged Deployment**: Only after complete testing and approval, changes are committed to production files (`index.html`, `script.js`)

### File Structure
- **Production**: `index.html` + `js/script.js` (stable, tested features)
- **Testing**: `index-test.html` + `js/script-test.js` (new features, testing)
- **Workflow**: Test → Validate → Deploy to Production

### Current Features in Testing
- Button click sound effects using `sound/click-button-04.mp3`
- Enhanced audio feedback system
- Volume control and error handling for blocked autoplay