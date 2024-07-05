import { Match } from '../../base/match.js';

export class Match4x4 {
    constructor({ stateManager }, constants, callback) {
        this.stateManager = stateManager;
        this.constants = constants;
        this.modes = constants.modes;
        this.pages = constants.pages;
        this.actions = constants.actions;
        this.errors = constants.errors;
        this.callback = callback;

        this.match = null;
    }

    getName() {
        return this.pages.match3x3;
    }

    handleCallback(reason) {
        switch(reason) {
            case this.actions.ask:
                this.match.destroy();
                this.callback(reason);
                break;

            default:
                throw new Error(this.errors.handleCallback);
        }
    }

    destroy() {
        this.match.destroy();
        this.match = null;
    }

    create() {
        this.match = new Match({ size: this.modes['4x4'], stateManager: this.stateManager }, this.constants, this.handleCallback.bind(this));
        this.match.create();
        this.match.setFocus();
    }
}
