import { Wrapper } from './wrapper.js';

export class Dialog {
    constructor({ message, buttons }, constants, callback) {
        this.message = message;
        this.buttons = buttons;
        this.constants = constants;
        this.types = constants.types;
        this.callback = callback;

        this.dialogElement = null;
        this.wrapper = null;
    }

    updateMessage(message) {
        this.messageElement.innerHTML = message;
    }

    setFocus() {
        this.wrapper.setFocus();
    }

    getElement() {
        return this.dialogElement;
    }

    handleCallback(reason) {
        this.callback(reason);
    }

    destroy() {
        if (this.messageElement && this.dialogElement) {
            this.dialogElement.removeChild(this.messageElement);
            this.messageElement = null;
        }
        this.wrapper.destroy();
        if (this.dialogElement && this.dialogElement.parentNode) {
            this.dialogElement.parentNode.removeChild(this.dialogElement);
            this.dialogElement = null;
        }
    }

    create() {
        this.dialogElement = document.createElement('div');
        this.dialogElement.classList.add('dialog');

        this.messageElement = document.createElement('div');
        this.messageElement.classList.add('dialog-message');
        this.messageElement.innerHTML = this.message;

        this.wrapper = new Wrapper({ type: this.types.button, config: this.buttons }, this.constants, this.handleCallback.bind(this));
        this.wrapper.create();

        this.dialogElement.appendChild(this.messageElement);
        this.dialogElement.appendChild(this.wrapper.getElement());
        document.body.appendChild(this.dialogElement);
    }
}
