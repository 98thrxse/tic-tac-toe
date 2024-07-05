import { Dialog } from '../../base/dialog.js';

export class Score {
    constructor({ stateManager }, constants, callback) {
        this.stateManager = stateManager;
        this.constants = constants;
        this.pages = constants.pages;
        this.strings = constants.strings;
        this.actions = constants.actions;
        this.callback = callback;

        this.dialog = null;
    }

    getName() {
        return this.pages.score;
    }

    handleCallback(reason) {
        switch(reason) {
            case this.actions.clear:
                this.stateManager.clearScore();
                this.dialog.updateMessage(`<b>Player:</b> ${this.stateManager.getPlayerScore()} - ${this.stateManager.getAIScore()} <b>:AI</b>`);
                break;
            case this.actions.back:
                this.dialog.destroy();
                this.callback(reason);
                break;

            default:
                throw new Error(this.errors.handleCallback);
        }
    }

    destroy() {
        this.dialog.destroy();
        this.dialog = null;
    }

    create() {
        this.dialog = new Dialog({
            message: `<b>Player:</b> ${this.stateManager.getPlayerScore()} - ${this.stateManager.getAIScore()} <b>:AI</b>`,
            buttons: [
                { text: this.strings.close, action: this.actions.back },
                { text: this.strings.clear, action: this.actions.clear }
            ]},
            this.constants,
            this.handleCallback.bind(this)
        );
        this.dialog.create();
        this.dialog.setFocus();
    }
}
