import { AIManager } from '../utils/aiManager.js';
import { CombinationsManager } from '../utils/combinationsManager.js';
import { Cell } from './cell.js';

export class Board {
    constructor({ size, stateManager, turnManager }, constants, callback) {
        this.size = size;
        this.stateManager = stateManager;
        this.turnManager = turnManager;
        
        this.constants = constants;
        this.actions = constants.actions;
        this.errors = constants.errors;
        this.keys = constants.keys;
        this.callback = callback;

        this.index = 0;
        this.boardElement = null;
        this.cells = [];
        this.lineElement = null;
        this.aiManager = null;
        this.combinationsManager = null;
    }

    getLastState() {
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].fillContent(this.stateManager.getCell(i));
            this.updateBoards(i, this.stateManager.getCell(i));
        }
        this.turnManager.setTurn(this.stateManager.getTurn());
    }

    setManagers() {
        this.aiManager = new AIManager({ size: this.size }, this.constants);
        this.combinationsManager = new CombinationsManager({ size: this.size });
        this.combinationsManager.setCombinations();
    }

    drawWinLine(combination) {
        const [a, b, c] = combination;
        const startLine = this.cells[a].getElement().getBoundingClientRect();
        const endLine = this.cells[c].getElement().getBoundingClientRect();
        this.lineElement = this.combinationsManager.createLine(startLine, endLine);
        this.boardElement.appendChild(this.lineElement);
    }

    updateBoards(index, symbol) {
        this.aiManager.updateBoard(index, symbol);
        this.combinationsManager.updateBoard(index, symbol);
        this.stateManager.updateBoard(index, symbol);
    }

    processCombinations() {
        const symbol = this.turnManager.isPlayerTurn() ? this.turnManager.getPlayerSymbol() : this.turnManager.getAISymbol();
        const combination = this.combinationsManager.checkWin(symbol)
        
        if (combination) {
            this.turnManager.disableTurns();
            this.stateManager.clearSession();
            this.drawWinLine(combination);
            this.turnManager.isPlayerTurn() ? this.stateManager.increasePlayerScore() : this.stateManager.increaseAIScore();
            this.callback(this.turnManager.isPlayerTurn() ? this.actions.win : this.actions.lose);

        } else if (this.combinationsManager.hasNoEmptyCells()) {
            this.turnManager.disableTurns();
            this.stateManager.clearSession();
            this.callback(this.actions.draw);
        }
    }

    processAI() {
        this.aiManager.makeMove(index => {
                if (this.cells[index]) {
                    this.cells[index].fillContent(this.turnManager.getAISymbol());
                    this.updateBoards(index, this.turnManager.getAISymbol());
                    this.processCombinations()
                    this.turnManager.switchTurn();
                    this.stateManager.setTurn(this.turnManager.isPlayerTurn());
                }
            },
            this.turnManager.getPlayerSymbol(),
            this.turnManager.getAISymbol(),
            this.combinationsManager.getCombinations()
        );
    }

    preventLoseFocus(reason) {
        switch(reason) {
            case this.keys.arrowUp:
                return this.index >= Math.sqrt(this.size);
            case this.keys.arrowDown:
                return this.index < this.size - Math.sqrt(this.size);
            case this.keys.arrowLeft:
                return (this.index) % Math.sqrt(this.size) != 0;
            case this.keys.arrowRight:
                return (this.index + 1) % Math.sqrt(this.size) != 0;
        }
    }

    setFocus() {
        this.cells[this.index].setFocus();
    }

    getElement() {
        return this.boardElement;
    }

    handleCallback(index, reason) {
        switch(reason) {
            case this.actions.move:
                this.updateBoards(index, this.turnManager.getPlayerSymbol());
                this.processCombinations();
                this.turnManager.switchTurn();
                this.stateManager.setTurn(this.turnManager.isPlayerTurn());
                !this.turnManager.isPlayerTurn() && this.processAI();
                break;

            case this.actions.focus:
                this.index = index;
                break;
        }
    }

    handleKeyDown(event) { 
        if (this.preventLoseFocus(event.code)) {
            switch(event.code) {
                case this.keys.arrowUp:
                    this.cells[this.index - Math.sqrt(this.size)].setFocus();
                    break;

                case this.keys.arrowDown:
                    this.cells[this.index + Math.sqrt(this.size)].setFocus();
                    break;

                case this.keys.arrowLeft:
                    this.cells[this.index - 1].setFocus();
                    break;

                case this.keys.arrowRight:
                    this.cells[this.index + 1].setFocus();
                    break;
            }
            event.stopPropagation();
        }
    }

    destroy() {
        if (this.lineElement && this.boardElement) {
            this.boardElement.removeChild(this.lineElement);
            this.lineElement = null;
        }

        this.cells.forEach(cell => cell.destroy());
        this.cells = [];

        if (this.boardElement && this.boardElement.parentNode) {
            this.boardElement.parentNode.removeChild(this.boardElement);
            this.boardElement = null;
        }
    }

    create() {
        this.boardElement = document.createElement('div');
        this.boardElement.classList.add('board');
        this.boardElement.style.gridTemplateColumns = `repeat(${Math.sqrt(this.size)}, 100px)`;
        this.boardElement.style.gridTemplateRows = `repeat(${Math.sqrt(this.size)}, 100px)`;

        this.setManagers();

        this.cells = Array.from({ length: this.size }, (_, index) => {
            const cell = new Cell(
                { turnManager: this.turnManager },
                this.constants,
                this.handleCallback.bind(this, index)
            );
            cell.create();
            this.boardElement.appendChild(cell.getElement());
            return cell;
        });

        this.boardElement.addEventListener('keydown', this.handleKeyDown.bind(this));

        (this.size == this.stateManager.getSize() && this.stateManager.getTurn() != null) && this.getLastState();
        !this.turnManager.isPlayerTurn() && this.processAI();
    }
}
