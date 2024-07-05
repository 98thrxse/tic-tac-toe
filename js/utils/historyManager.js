export class HistoryManager {
    constructor() {
        this.history = [];
    }

    getLength() {
        return this.history.length;
    }

    getPage(index) {
        return this.history[index];
    }

    addPage(page) {
        this.history.push(page);
    }
}
