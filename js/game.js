import { JSONManager } from './utils/jsonManager.js';
import { HistoryManager } from './utils/historyManager.js';
import { StateManager } from './utils/stateManager.js';
import { Controls } from './pages/dialogs/controls.js';
import { Question } from './pages/dialogs/question.js';
import { Score } from './pages/dialogs/score.js';
import { Match3x3 } from './pages/matches/match3x3.js';
import { Ads } from './pages/ads.js';

class Game {
    constructor() {
        this.init();
    }

    async setManagers() {
        this.constants = await JSONManager.getAll();
        this.pages = this.constants.pages;
        this.actions = this.constants.actions;
        this.keys = this.constants.keys;
        this.errors = this.constants.errors;

        this.historyManager = new HistoryManager();
        this.stateManager = new StateManager();
    }

    destroy(page) {
        page.destroy();
        page = null;
    }

    create(type) {
        let page = null;
        switch (type) {
            case this.pages.controls:
                page = new Controls(this.constants, this.handleCallback.bind(this));
                break;

            case this.pages.question:
                page = new Question(this.constants, this.handleCallback.bind(this));
                break;

            case this.pages.score:
                page = new Score({ stateManager: this.stateManager }, this.constants, this.handleCallback.bind(this));
                break;

            case this.pages.match3x3:
                page = new Match3x3({ stateManager: this.stateManager }, this.constants, this.handleCallback.bind(this));
                break;
            
            case this.pages.ads:
                page = new Ads();
                break;
                
            default:
                throw new Error(this.errors.handleCallback);
        }

        page.create();
        this.historyManager.addPage(page);
    }

    handleCallback(reason) {
        const lastPage = this.historyManager.getPage(this.historyManager.getLength() - 1);
        const prevPage = this.historyManager.getPage(this.historyManager.getLength() - 2);
        lastPage && this.destroy(lastPage);

        switch(reason) {
            case this.actions.back:
                this.create(prevPage.getName());
                break;

            case this.actions.play:
                this.create(this.pages.match3x3);
                break;

            case this.actions.ask:
                this.create(this.pages.question);
                break;

            case this.actions.ads:
                this.create(this.pages.ads);
                break;

            default:
                throw new Error(this.errors.create);
        }
    }

    handleMouseDown(event) {
        event.preventDefault();
    }

    handleKeyDown(event) {
        event.preventDefault();
        const lastPage = this.historyManager.getPage(this.historyManager.getLength() - 1);

        switch(event.code) {
            case this.keys.tab:
                if (lastPage.getName() !== this.pages.controls && lastPage.getName() !== this.pages.score) {
                    this.destroy(lastPage);
                    this.create(this.pages.score);
                }
                break;

            case this.keys.backspace:
                if (lastPage.getName() !== this.pages.controls && lastPage.getName() !== this.pages.score) {
                    this.destroy(lastPage); 
                    this.create(this.pages.controls);
                }
                break;

            case this.keys.space:
                this.randomizeBackgroundColor();
                break;
        }
    }

    randomizeBackgroundColor() {
        const hex = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += hex[Math.floor(Math.random() * hex.length)];
        }
        document.body.style.backgroundColor = color;
    }

    async init() {
        this.randomizeBackgroundColor();
        await this.setManagers();
        this.create(this.pages.question);

        document.body.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.body.addEventListener('mousedown', this.handleMouseDown.bind(this));
    }
}

new Game();
