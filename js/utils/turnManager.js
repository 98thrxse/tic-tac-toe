export class TurnManager {
    constructor(constants) {
        this.constants = constants;
        this.strings = constants.strings;

        this.active = null;
        this.turn = null;
        this.playerSymbol = null;
        this.aiSymbol = null;
        this.listeners = [];
    }

    disableTurns() {
        this.active = false;
    }

    isTurnsActive() {
        return this.active;
    }
    
    addListener(listener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener.handleTurnManager());
    }

    setTurn(turn) {
        this.turn = turn;
    }

    switchTurn() {
        this.isTurnsActive() && (this.turn = !this.turn, this.notifyListeners());
    }

    isPlayerTurn() {
        return this.turn;
    }

    getPlayerSymbol() {
        return this.playerSymbol;
    }

    getAISymbol() {
        return this.aiSymbol;
    }

    setPlayerSymbol(playerSymbol) {
        this.playerSymbol = playerSymbol;
    }

    setAISymbol(aiSymbol) {
        this.aiSymbol = aiSymbol;
    }

    setActive(active) {
        this.active = active;
    }

    enableTurns() {
        this.setActive(true);
        this.turn = Math.random() < 0.5;
        this.playerSymbol = this.turn ? this.strings.x : this.strings.o;
        this.aiSymbol = this.turn ? this.strings.o : this.strings.x;
    }
}
