export class StateManager {
    constructor() {
        this.size = null;
        this.playerSymbol = null;
        this.aiSymbol = null;
        this.playerScore = 0;
        this.aiScore = 0;
        this.turn = null;
        this.board = [];
    }

    getAISymbol() {
        return this.aiSymbol;
    }

    setAISymbol(aiSymbol) {
        this.aiSymbol = aiSymbol;
    }

    getPlayerSymbol() {
        return this.playerSymbol;
    }

    setPlayerSymbol(playerSymbol) {
        this.playerSymbol = playerSymbol;
    }

    getSize() {
        return this.size;
    }

    setSize(size) {
        this.size = size;
        (this.board.length != this.size) && (this.board = Array(this.size).fill(null));
    }

    increasePlayerScore() {
        this.playerScore++;
    }

    increaseAIScore() {
        this.aiScore++;
    }

    getPlayerScore() {
        return this.playerScore;
    }

    getAIScore() {
        return this.aiScore;
    }

    setTurn(turn) {
        this.turn = turn;
    }

    getTurn() {
        return this.turn;
    }

    getCell(index) {
        return this.board[index];
    }

    updateBoard(index, symbol) {
        this.board[index] = symbol;
    }

    clearSession() {
        this.size = null;
        this.board = [];
        this.turn = null;
    }

    clearScore() {
        this.playerScore = 0;
        this.aiScore = 0;
    }

    clearSymbol() {
        this.playerSymbol = null;
        this.aiSymbol = null;
    }

    clearAll() {
        this.clearSession();
        this.clearBoard();
        this.clearSymbol();
    }
}
