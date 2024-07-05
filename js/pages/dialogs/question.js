import { Dialog } from '../../base/dialog.js';

export class Question {
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
        return this.pages.question;
    }

    handleCallback(reason) {
        switch(reason) {
            case this.actions.redirect:
                this.dialog.destroy();
                window.location.href = this.strings.url;
                break;

            case this.actions.play:
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
            message: this.strings.question,
            buttons: [
                { text: this.strings.yes, action: this.actions.play },
                { text: this.strings.no, action: this.actions.redirect }
            ]},
            this.constants,
            this.handleCallback.bind(this)
        );
        this.dialog.create();
        this.dialog.setFocus();
    }
}
