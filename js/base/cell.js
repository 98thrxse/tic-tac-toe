export class Cell {
    constructor({ turnManager }, constants, callback) {
        this.turnManager = turnManager;
        this.constants = constants;
        this.keys = constants.keys;
        this.actions = constants.actions;
        this.callback = callback;

        this.cellElement = null;
    }

    fillContent(symbol) {
        this.cellElement.textContent = symbol;
    }

    isEmpty() {
        return !this.cellElement.textContent.length;
    }

    setFocus() {
        this.cellElement.focus();
    }

    handleFocus() {
        this.callback(this.actions.focus);
    }

    getElement() {
        return this.cellElement;
    }

    handleKeyDown(event) {
        switch(event.code) {
            case this.keys.enter:
                this.turnManager.isTurnsActive() && this.turnManager.isPlayerTurn() && this.isEmpty() && (this.fillContent(this.turnManager.getPlayerSymbol()), this.callback(this.actions.move));
                break;
        }
    }

    destroy() {
        if (this.cellElement && this.cellElement.parentNode) {
            this.cellElement.parentNode.removeChild(this.cellElement);
            this.cellElement = null;
        }
    }

    create() {
        this.cellElement = document.createElement('div');
        this.cellElement.classList.add('cell');
        this.cellElement.setAttribute('tabindex', '0');

        this.cellElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.cellElement.addEventListener('focus', this.handleFocus.bind(this));
    }
}
