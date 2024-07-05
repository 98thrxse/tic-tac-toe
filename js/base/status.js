export class Status {
    constructor({ turnManager }, constants) {
        this.turnManager = turnManager;
        this.constants = constants;
        this.strings = constants.strings;
        this.actions = constants.actions;

        this.statusElement = null;
    }

    handleTurnManager() {
        this.setContent(this.turnManager.isPlayerTurn() ? this.strings.playerTurn : this.strings.aiTurn);
    }

    setContent(text) {
        this.statusElement.textContent = text;
    }

    getElement() {
        return this.statusElement;
    }

    destroy() {
        if (this.statusElement && this.statusElement.parentNode) {
            this.statusElement.parentNode.removeChild(this.statusElement);
            this.statusElement = null;
        }
    }

    create() {
        this.statusElement = document.createElement('div');
        this.statusElement.classList.add('status');
        this.turnManager.addListener(this);
        this.handleTurnManager()
    }
}
