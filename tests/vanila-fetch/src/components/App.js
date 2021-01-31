import '../../assets/css/todo.css';

import { counter_heading_template, todo_template } from './todoTemplates';
import API from '../plugins/api';

// init api
const api = new API();

export default class App {
    constructor (options) {
        this.elem = document.getElementById(options.target);
        this.todos = [];
        this.getData();
        this.events = new Map();
    }

    async getData () {
        this.todos = await api.fetch('/todos');

        if (this.events.has('ready')) {
            this.events.get('ready')(this.todos);
        }
    }

    get done () {
        return this.todos.filter(todo => todo.completed).length;
    }

    get len () {
        return this.todos.length;
    }

    on (event, callback) {
        this.events.set(event, callback.bind(this));
    }

    backEventHandler () {
        window.history.back();
    }

    eventHandler (event) {
        // cache element
        const elem = event.target;
        // update todos state and re-assing variable so we can have autoupdate
        this.todos = this.todos.map((todo) => {
            if (todo.id == elem.id) {
                todo.completed = elem.checked;
            }
            return todo;
        });
        // re-render app
        this.render();
    }

    bindEventHandlers () {
        // bind back button
        const backButton = document.getElementById('back');
        backButton.addEventListener('click', this.backEventHandler.bind(this));

        // bind checkboxes
        this.todos.forEach(item => {
            const todo = document.getElementById(item.id);
            todo.addEventListener('change', this.eventHandler.bind(this));
        })
    }

    createHTML () {
        return `<div>
            <button id="back">Back</button>
            ${counter_heading_template({ done: this.done, len: this.len })}
                <ul>
                    ${this.todos.map(todo => todo_template(todo)).join('')}
                </ul>
            </div>
        </main>`;
    }

    render () {
        this.elem.innerHTML = this.createHTML();
        this.bindEventHandlers();
    }
};