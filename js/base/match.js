import { TurnManager } from '../utils/turnManager.js';
import { Status } from './status.js';
import { Board } from './board.js';
import { Wrapper } from './wrapper.js';

export class Match {
    constructor({ size, stateManager }, constants, callback) {
        this.size = size;
        this.stateManager = stateManager;
        this.constants = constants;
        this.types = constants.types;
        this.keys = constants.keys;
        this.strings = constants.strings;
        this.actions = constants.actions;
        this.callback = callback;

        this.matchElement = null;
        this.board = null;
        this.wrapper = null;
    }

    setManagers() {
        this.turnManager = new TurnManager(this.constants);
        this.stateManager.setSize(this.size);

        if (this.stateManager.getPlayerSymbol() == null || this.stateManager.getAISymbol() == null) {
            this.turnManager.enableTurns();
            this.stateManager.setPlayerSymbol(this.turnManager.getPlayerSymbol());
            this.stateManager.setAISymbol(this.turnManager.getAISymbol());
        } else {
            this.turnManager.setActive(true);
            this.turnManager.setPlayerSymbol(this.stateManager.getPlayerSymbol());
            this.turnManager.setAISymbol(this.stateManager.getAISymbol());
        }
    }

    setFocus() {
        this.board.setFocus();
    }

    getElement() {
        return this.matchElement;
    }

    handleCallback(reason) {
        switch(reason) {
            case this.actions.win:
                this.status.setContent(this.strings.win);
                break;

            case this.actions.lose:
                this.status.setContent(this.strings.lose);
                break;

            case this.actions.draw:
                this.status.setContent(this.strings.draw);
                break;

            default:
                this.callback(reason);
        }
    }

    handleKeyDown(event) {
        switch(event.code) {
            case this.keys.arrowUp:
                this.board.setFocus();
                break;

            case this.keys.arrowDown:
                this.wrapper.setFocus();
                break;
        }
    }

    destroy() {
        this.status.destroy();
        this.board.destroy();
        this.wrapper.destroy();
        this.turnManager = null;
        if (this.matchElement && this.matchElement.parentNode) {
            this.matchElement.parentNode.removeChild(this.matchElement);
            this.matchElement = null;
        }
    }

    create() {
        this.matchElement = document.createElement('div');
        this.matchElement.classList.add('match');

        this.setManagers();

        this.status = new Status({ turnManager: this.turnManager }, this.constants);
        this.status.create();

        this.board = new Board(
            {
                size: this.size,
                stateManager: this.stateManager,
                turnManager: this.turnManager,
            },
            this.constants,
            this.handleCallback.bind(this)
        );
        this.board.create();

        this.wrapper = new Wrapper(
            {
                type: this.types.button,
                config: [{ text: this.strings.done, action: this.actions.ask }]
            },
            this.constants,
            this.handleCallback.bind(this)
        );
        this.wrapper.create();

        this.matchElement.appendChild(this.status.getElement());
        this.matchElement.appendChild(this.board.getElement());
        this.matchElement.appendChild(this.wrapper.getElement());
        document.body.appendChild(this.matchElement);

        this.matchElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
}
