// Difficulty settings for position generation
const DIFFICULTY_SETTINGS = {
    easy: { pieces: 3, mainPieces: 1 },
    medium: { pieces: 5, mainPieces: 2 },
    hard: { pieces: 7, mainPieces: 3 }
};

const GAME_DURATION = 180; // 3 minutes in seconds
const HIGH_SCORES_TO_KEEP = 5;

// Helper to generate random positions
function generatePosition(difficulty = 'medium') {
    const chess = new Chess();
    chess.clear();
    
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const pieces = ['r', 'n', 'b', 'q', 'k', 'p'];
    const mainPieces = ['r', 'n', 'b', 'q'];
    const squares = Array.from({ length: 64 }, (_, i) => {
        const file = String.fromCharCode(97 + (i % 8));
        const rank = Math.floor(i / 8) + 1;
        return `${file}${rank}`;
    });
    
    // Place required main pieces
    for (let i = 0; i < settings.mainPieces; i++) {
        const piece = mainPieces[Math.floor(Math.random() * mainPieces.length)];
        const color = Math.random() < 0.5 ? 'w' : 'b';
        while (true) {
            const square = squares[Math.floor(Math.random() * squares.length)];
            if (!chess.get(square)) {
                chess.put({ type: piece, color: color }, square);
                break;
            }
        }
    }
    
    // Fill remaining pieces
    for (let i = settings.mainPieces; i < settings.pieces; i++) {
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        const color = Math.random() < 0.5 ? 'w' : 'b';
        while (true) {
            const square = squares[Math.floor(Math.random() * squares.length)];
            if (!chess.get(square)) {
                chess.put({ type: piece, color: color }, square);
                break;
            }
        }
    }
    
    return chess.fen();
}

// Vue app
const app = Vue.createApp({
    data() {
        return {
            timeLeft: GAME_DURATION,
            score: 0,
            targetPosition: '',
            positionHidden: false,
            showingResults: false,
            gameOver: false,
            gameStarted: false,
            timer: null,
            targetBoard: null,
            playerBoard: null,
            highScores: JSON.parse(localStorage.getItem('chessRushHighScores') || '[]')
        };
    },
    
    mounted() {
        // Don't initialize boards on mount anymore
    },
    
    methods: {
        initBoards() {
            const config = {
                draggable: false,
                position: 'start',
                pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
                sparePieces: true
            };
            
            this.targetBoard = Chessboard('targetBoard', { ...config, draggable: false, sparePieces: false });
            this.playerBoard = Chessboard('playerBoard', config);
        },
        
        startGame() {
            this.gameStarted = true;
            // Wait for DOM update before initializing boards
            this.$nextTick(() => {
                this.initBoards();
                this.startNewGame();
            });
        },
        
        startNewGame() {
            this.timeLeft = GAME_DURATION;
            this.score = 0;
            this.gameOver = false;
            this.startTimer();
            this.generateNewPosition();
        },
        
        startTimer() {
            if (this.timer) clearInterval(this.timer);
            
            this.timer = setInterval(() => {
                this.timeLeft--;
                
                if (this.timeLeft <= 0) {
                    this.endGame();
                }
            }, 1000);
        },
        
        generateNewPosition() {
            this.targetPosition = generatePosition();
            this.targetBoard.position(this.targetPosition);
            // Reset player board with dragging disabled
            document.querySelector('.game-container').classList.remove('memorizing');
            this.playerBoard.destroy();
            this.playerBoard = Chessboard('playerBoard', {
                draggable: false,
                position: 'start',
                pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
                sparePieces: true
            });
            this.playerBoard.clear();
            this.positionHidden = false;
            this.showingResults = false;
        },
        
        startMemorizing() {
            this.positionHidden = true;
            this.targetBoard.clear();
            // Enable dragging after clicking Ready
            document.querySelector('.game-container').classList.add('memorizing');
            this.playerBoard.destroy();
            this.playerBoard = Chessboard('playerBoard', {
                draggable: true,
                position: 'start',
                pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
                sparePieces: true
            });
            this.playerBoard.clear();
        },
        
        submitPosition() {
            const playerFen = this.playerBoard.fen();
            const targetChess = new Chess();
            const playerChess = new Chess();
            
            targetChess.load(this.targetPosition);
            playerChess.load(playerFen);
            
            let correctSquares = 0;
            const totalPieces = this.targetPosition.split(' ')[0].match(/[prnbqkPRNBQK]/g)?.length || 0;
            
            // Compare positions
            for (let i = 0; i < 64; i++) {
                const file = String.fromCharCode(97 + (i % 8));
                const rank = Math.floor(i / 8) + 1;
                const square = `${file}${rank}`;
                
                const targetPiece = targetChess.get(square);
                const playerPiece = playerChess.get(square);
                
                if ((!targetPiece && !playerPiece) || 
                    (targetPiece && playerPiece && 
                     targetPiece.type === playerPiece.type && 
                     targetPiece.color === playerPiece.color)) {
                    correctSquares++;
                }
            }
            
            // Show results
            this.targetBoard.position(this.targetPosition);
            this.showingResults = true;
            
            // Update score based on accuracy
            const accuracy = correctSquares / 64;
            const pieceScore = Math.round((correctSquares / totalPieces) * 100);
            this.score += pieceScore;
        },
        
        nextPosition() {
            this.generateNewPosition();
        },
        
        endGame() {
            clearInterval(this.timer);
            this.gameOver = true;
            
            // Update high scores
            this.highScores.push(this.score);
            this.highScores.sort((a, b) => b - a);
            this.highScores = this.highScores.slice(0, HIGH_SCORES_TO_KEEP);
            localStorage.setItem('chessRushHighScores', JSON.stringify(this.highScores));
        },
        
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }
});

app.mount('#app'); 