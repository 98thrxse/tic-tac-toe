export class AIManager {
    constructor({ size }) {
        this.board = Array(size).fill(null);
    }

    getRandomTimeout() {
        return Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    }

    findEmptyCells() {
        return this.board
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
    }

    findWinningMove(symbol, combinations) {
        const emptyCells = this.findEmptyCells();
        
        for (const emptyIndex of emptyCells) {
            for (const combination of combinations) {
                if (combination.every(index => this.board[index] == symbol || index == emptyIndex)) {
                    return emptyIndex;
                }
            }
        }
        return null;
    }

    findPreviewWinningMove(symbol, combinations) {
        const emptyCells = this.findEmptyCells();
        
        for (const emptyIndex of emptyCells) {
            for (const combination of combinations) {
                if (combination.every(index => this.board[index] == symbol || emptyCells.includes(index))) {
                    return emptyIndex;
                }
            }
        }
        return null;
    }

    makeMove(callback, playerSymbol, aiSymbol, combinations) {
        setTimeout(() => {
            const emptyCells = this.findEmptyCells();
            let selectedIndex;

            selectedIndex = this.findWinningMove(aiSymbol, combinations);
            if (selectedIndex !== null) {
                callback(selectedIndex);
                return;
            }

            selectedIndex = this.findWinningMove(playerSymbol, combinations);
            if (selectedIndex !== null) {
                callback(selectedIndex);
                return;
            }

            selectedIndex = this.findPreviewWinningMove(aiSymbol, combinations);
            if (selectedIndex !== null) {
                callback(selectedIndex);
                return;
            }

            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            selectedIndex = emptyCells[randomIndex];
            callback(selectedIndex);
        }, this.getRandomTimeout());
    }

    updateBoard(index, symbol) {
        this.board[index] = symbol;
    }
}
