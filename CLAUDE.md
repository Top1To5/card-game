# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a minimal repository with only a basic directory structure:
- `output/` - Empty directory
- `system/` - Empty directory  
- `task/` - Empty directory

## Current State

This is a fully functional matching card game project with the following structure:
- **Production Version**: `index.html` + `js/script.js` (stable, tested features)
- **Test Version**: `index-test.html` + `js/script-test.js` (new features under testing)
- **Assets**: `css/`, `image/`, `sound/` directories with game resources
- **Documentation**: `system/` directory with project documentation

## Development & Testing Workflow

### Testing Strategy
**IMPORTANT**: All new features and changes must be implemented in the test environment first.

1. **Test-First Development**: 
   - Implement all changes in `index-test.html` and `js/script-test.js`
   - Test version includes visual banner indicator
   - Isolated testing environment prevents production issues

2. **Validation Process**:
   - Complete testing of all functionality
   - User acceptance testing
   - Performance validation

3. **Production Deployment**:
   - Only after complete testing approval
   - Commit changes from test files to production files (`index.html`, `js/script.js`)

### File Structure
- **Production**: `index.html` + `js/script.js` (stable, live version)
- **Testing**: `index-test.html` + `js/script-test.js` (development version)
- **Assets**: Shared across both versions (css/, image/, sound/)

### Current Features
- Matching card game with airline-themed cards
- Timer system with precise tracking
- Leaderboard with localStorage persistence
- Sound effects for button interactions using `sound/click-button-04.mp3`
- Background music with loop functionality using `sound/background-music-fast-feel-banana.mp3`
- Music controls with volume adjustment (30% default volume)
- Two-choice music prompt (Enable Music / Close Music)
- Responsive design with animations
- Modal system for game completion and leaderboard

### Audio Features
- **Button Sounds**: All interactive buttons play click sound
- **Background Music**: Auto-loop background music with volume control
- **Music Controls**: Toggle play/pause and volume slider (0-100%)
- **Smart Prompts**: User choice for music enable/disable when autoplay is blocked
- **Volume Icons**: Dynamic icons based on volume level (🔇/🔉/🔊)

### Testing Notes
- Test version includes prominent orange banner: "🧪 TEST VERSION"
- Production version has clean interface without test indicators
- All audio features include autoplay blocking handling and user interaction prompts