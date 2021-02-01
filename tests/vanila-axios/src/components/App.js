import '../../assets/css/todo.css';

import { counter_heading_template, todo_template, add_new_todo, get_completed_todos } from './todoTemplates';
import API from '../plugins/api';

// init api
const api = new API();

export default class App {
    constructor (options) {
        this.elem = document.getElementById(options.target);
        this.todos = [];
        this.getData();
        this.userId = options.userId || 1;
        this.events = new Map();
        this.todoSchema = {
            userId: null,
            id: null,
            title: '',
            completed: false
        };
        this.newTodo = '';
        this.completedTodos = [];
        this.timeout = false;
        this.loader = false;
    }

    async getData () {
        this.todos = await api.get('/todos');

        if (this.events.has('ready')) {
            this.events.get('ready')(this.todos);
        }
    }

    async addNewTodo () {
        if (this.newTodo) {
            const data = Object.assign({}, this.todoSchema, {
                userId: this.userId,
                id: this.todos.length + 1,
                title: this.newTodo,
                completed: false
            });

            this.todos.push(data);
            this.newTodo = '';
            await api.post('/todo', data);
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

    updateTodoEventHandler (event) {
        // cache element
        const elem = event.target;
        // update todos state and re-assing variable so we can have autoupdate
        this.todos = this.todos.map((todo) => {
            if (todo.id == elem.id) {
                todo.completed = elem.checked;
                api.put(`/todo/${todo.id}`, todo);
            }
            return todo;
        });
        // re-render app
        this.render();
    }

    newTodoEventHandler (event) {
        this.newTodo = event.target.value;
    }

    formEventHandler (event) {
        event.preventDefault();
        this.addNewTodo();
        // re-render app
        this.render();
    }

    async getCompletedEventHandler (event) {
        event.preventDefault();
        this.loader = true;
        this.completedTodos = await api.get('/todos/completed');
        if (this.completedTodos.isError) {
            this.completedTodos = [];
            this.timeout = true;
        }
        this.loader = false;

        this.render();
    }

    bindEventHandlers () {
        // new todo handler
        const newTodo = document.getElementById('newTodo');
        newTodo.addEventListener('keyup', this.newTodoEventHandler.bind(this));

        // new todo handler
        const form = document.getElementById('form');
        form.addEventListener('submit', this.formEventHandler.bind(this));

        // new todo handler
        const getCompleted = document.getElementById('getCompleted');
        getCompleted.addEventListener('click', this.getCompletedEventHandler.bind(this));

        // bind back button
        const backButton = document.getElementById('back');
        backButton.addEventListener('click', this.backEventHandler.bind(this));

        // bind checkboxes
        this.todos.forEach(item => {
            const todo = document.getElementById(item.id);
            todo.addEventListener('change', this.updateTodoEventHandler.bind(this));
        })
    }

    createHTML () {

        return `<div>
            <button id="back">Back</button>

            <form action="" id="form">
                ${add_new_todo()}
                ${get_completed_todos(this.timeout, this.completedTodos)}
            </form >

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
        document.getElementById('newTodo').focus();
    }
};