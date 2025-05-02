# Chess Memo Rush

A fast-paced chess memory training game. Test and improve your ability to memorize chess positions under time pressure.

## How to Play

1. **Start the Game**
   - Click "Start Game" to begin a 3-minute session
   - You'll see a random chess position on the left board

2. **Memorize & Recreate**
   - Study the position carefully
   - When ready, click the "Ready" button
   - The target position will disappear
   - Drag pieces from the spare pieces tray to recreate the position on the right board

3. **Submit & Score**
   - Click "Submit" when you think you've recreated the position correctly
   - You'll see both positions side by side for comparison
   - Score 1 point for each correctly placed piece
   - Click "Next Position" to continue

4. **Game End**
   - The game ends after 3 minutes
   - Your final score is the total of all correctly placed pieces
   - High scores are saved locally in your browser

## Features

- Pure client-side implementation (no server required)
- Progressive difficulty in generated positions
- Local storage for high scores
- Responsive design works on both desktop and mobile
- No build step required - just open in a browser

## Technical Details

Built with:
- Vue.js 3 (CDN version)
- chessboard.js for the board UI
- chess.js for position generation and validation
- Pure HTML, CSS, and JavaScript
- No build tools or npm required

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ChessMemoRush.git
   ```

2. Open `index.html` in your web browser

That's it! No other installation or setup required.

## Deployment

The game can be deployed on any static file hosting service:
- GitHub Pages
- Netlify
- Vercel
- Or any web server that can serve static files

## License

MIT License - feel free to use, modify, and distribute as you wish. 