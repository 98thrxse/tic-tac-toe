import { Dialog } from '../../base/dialog.js';

export class Controls {
    constructor(constants, callback) {
        this.constants = constants;
        this.pages = constants.pages;
        this.strings = constants.strings;
        this.actions = constants.actions;
        this.errors = constants.errors;
        this.callback = callback;

        this.dialog = null;
    }

    getName() {
        return this.pages.controls;
    }

    handleCallback(reason) {
        switch(reason) {
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
            message: this.strings.controls,
            buttons: [
                { text: this.strings.close, action: this.actions.back }
            ]},
            this.constants,
            this.handleCallback.bind(this)
        );
        this.dialog.create();
        this.dialog.setFocus();
    }
}
