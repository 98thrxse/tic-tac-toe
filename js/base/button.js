export class Button {
    constructor({ text, action }, constants, callback) {
        this.text = text;
        this.action = action;
        this.constants = constants;
        this.actions = constants.actions;
        this.keys = constants.keys;
        this.callback = callback;

        this.buttonElement = null;
    }

    setFocus() {
        this.buttonElement.focus();
    }
    
    handleFocus() {
        this.callback(this.actions.focus);
    }

    getElement() {
        return this.buttonElement;
    }

    handleKeyDown(event) {
        switch(event.code) {
            case this.keys.enter:
                this.callback(this.action);
                break;
        }
    }

    destroy() {
        if (this.buttonElement && this.buttonElement.parentNode) {
            this.buttonElement.parentNode.removeChild(this.buttonElement);
            this.buttonElement = null;
        }
    }

    create() {
        this.buttonElement = document.createElement('button');
        this.buttonElement.classList.add('button');
        this.buttonElement.textContent = this.text;
        this.buttonElement.dataset.action = this.action;

        this.buttonElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.buttonElement.addEventListener('focus', this.handleFocus.bind(this));
    }
}
