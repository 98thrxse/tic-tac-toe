export class CombinationsManager {
    constructor({ size }) {
        this.size = size;

        this.board = Array(this.size).fill(null);
        this.combinations = [];
    }

    createLine(start, end) {
        const lineElement = document.createElement('div');
        lineElement.classList.add('line');
    
        let startX, startY, endX, endY;

        if (start.top == end.top) {
            startX = start.left - start.width / 5;
            startY = start.top + start.height / 2;
            endX = end.right + end.width / 5;
            endY = end.top + end.height / 2;
        } else if (start.left == end.left) {
            startX = start.left + start.width / 2;
            startY = start.top - start.height / 5;
            endX = end.left + end.width / 2;
            endY = end.bottom + end.height / 5;
        } else{
            startX = start.left < end.left ? start.left - start.width / 5 : start.right + start.width / 5;
            startY = start.top < end.top ? start.top - start.height / 5 : start.bottom + start.height / 5;
            endX = start.left < end.left ? end.right + end.width / 5 : end.left - end.width / 5;
            endY = start.top < end.top ? end.bottom + end.height / 5 : end.top - end.height / 5;
        }
    
        const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

        lineElement.style.width = `${length}px`;
        lineElement.style.transformOrigin = '0 0';
        lineElement.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`;
    
        return lineElement;
    }

    updateBoard(index, symbol) {
        this.board[index] = symbol;
    }

    hasNoEmptyCells() {
        return !this.board.includes(null);
    }

    checkWin(symbol) {
        for (const combination of this.combinations) {
            if (combination.every(index => this.board[index] == symbol)) {
                return combination;
            }
        }

        return null;
    }

    getCombinations() {
        return this.combinations;
    }

    setCombinations() {
        for (let i = 0; i < Math.sqrt(this.size); i++) {
            const row = [];
            for (let j = 0; j < Math.sqrt(this.size); j++) {
                row.push(i * Math.sqrt(this.size) + j);
            }
            this.combinations.push(row);
        }

        for (let i = 0; i < Math.sqrt(this.size); i++) {
            const column = [];
            for (let j = 0; j < Math.sqrt(this.size); j++) {
                column.push(j * Math.sqrt(this.size) + i);
            }
            this.combinations.push(column);
        }

        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < Math.sqrt(this.size); i++) {
            diagonal1.push(i * (Math.sqrt(this.size) + 1));
            diagonal2.push((i + 1) * (Math.sqrt(this.size) - 1));
        }
        this.combinations.push(diagonal1, diagonal2);
    }
}
