import { Button } from './button.js';

export class Wrapper {
    constructor({ type, config }, constants, callback) {
        this.type = type;
        this.config = config;
        this.constants = constants;
        this.types = constants.types;
        this.actions = constants.actions;
        this.keys = constants.keys;
        this.errors = constants.errors;
        this.callback = callback;

        this.index = 0;
        this.wrapperElement = null;
        this.elements = [];
    }

    setFocus() {
        this.elements[this.index].setFocus();
    }

    preventLoseFocus(reason) {
        switch(reason) {
            case this.keys.arrowLeft:
                return this.index != 0;
            case this.keys.arrowRight:
                return this.index != this.elements.length - 1;
        }
    }

    getElement() {
        return this.wrapperElement;
    }

    handleCallback(index, reason) {
        switch(reason) {
            case this.actions.focus:
                this.index = index;
                break;

            default:
                this.callback(reason);
        }
    }

    handleKeyDown(event) {
        if (this.preventLoseFocus(event.code)) {
            switch(event.code) {
                case this.keys.arrowLeft:
                    this.elements[this.index - 1].setFocus();
                    break;

                case this.keys.arrowRight:
                    this.elements[this.index + 1].setFocus();
                    break;
            }
        }
    }

    destroy() {
        this.elements.forEach(button => button.destroy());
        this.elements = [];
        
        if (this.wrapperElement && this.wrapperElement.parentNode) {
            this.wrapperElement.parentNode.removeChild(this.wrapperElement);
            this.wrapperElement = null;
        }
    }

    create() {
        this.wrapperElement = document.createElement('div');

        switch(this.type) {
            case this.types.button:
                this.elements = this.config.map((data, index) => {
                    const button = new Button(data, this.constants, this.handleCallback.bind(this, index));
                    button.create();
                    this.wrapperElement.appendChild(button.getElement());
                    return button;
                });
                break;
        }

        this.wrapperElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
}
