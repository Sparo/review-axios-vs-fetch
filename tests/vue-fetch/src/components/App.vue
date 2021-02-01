<template>
    <div id="vue">
        <button @click="back">Back</button>

        <Loader v-if="showLoader || loader" />
        <div>
            <form action="">
                <input
                    type="text"
                    v-model="newTodo"
                    placeholder="type in todo"
                >
                <button
                    type="submit"
                    @click.prevent="addNewTodo"
                >
                    Add
                </button>
                <button @click.prevent="getCompleted">Get completed todos</button>
                <span v-if="!timeout">{{ completedTodos.map(item => item.id) }}</span>
                <span
                    v-if="timeout"
                    style="color: red"
                > Timeout Abort...</span>
            </form>
            <h3>
                Done {{done}} of {{todos.length}} <i>&#8592; this is reactive heading</i>
            </h3>
            <ul>
                <li
                    v-for="todo in todos"
                    :key="todo.id"
                >
                    <input
                        type="checkbox"
                        :id="todo.id"
                        :checked="todo.completed"
                        @change="updateToDo"
                    />
                    <label
                        :for="todo.id"
                        :class="{'strike': todo.completed}"
                    >
                        {{ todo.title }}
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Loader from './Loader';
export default {
    name: 'App',
    props: ['userId'],
    components: {
        Loader
    },
    data() {
        return {
            todos: [],
            newTodo: '',
            completedTodos: [],
            timeout: false,
            loader: false,
            todoSchema: {
                userId: null,
                id: null,
                title: '',
                completed: false
            }
        };
    },
    async mounted() {
        this.todos = await this.$api.get('/todos');
    },
    computed: {
        done() {
            return this.todos.filter((item) => item.completed).length;
        },
        showLoader() {
            return this.todos.length === 0;
        }
    },
    methods: {
        updateToDo(event) {
            // cache element
            const elem = event.target;
            // update todos state and re-assing variable so we can have autoupdate
            this.todos.forEach((todo) => {
                if (todo.id == elem.id) {
                    todo.completed = elem.checked;
                    this.$api.put(`/todo/${todo.id}`, todo);
                }
            });
        },

        addNewTodo() {
            const data = Object.assign({}, this.todoSchema, {
                userId: this.userId,
                id: this.todos.length + 1,
                title: this.newTodo,
                completed: false
            });

            this.todos.push(data);
            this.$api.post('/todo', data);
            this.newTodo = '';
        },

        async getCompleted() {
            this.loader = true;
            this.completedTodos = await this.$api.get('/todos/completed');
            if (this.completedTodos.isError) {
                this.completedTodos = [];
                this.timeout = true;
            }
            this.loader = false;
        },

        back() {
            window.history.back();
        }
    }
};
</script>

<style>
h3 > i {
    font-weight: 200;
    color: orange;
}

ul {
    list-style-type: none;
}
li {
    padding: 5px;
    display: flex;
    align-items: center;
    line-height: 2em;
}
li:hover {
    background-color: aliceblue;
    cursor: pointer;
}
input {
    margin: 0.51em;
}
label {
    cursor: pointer;
}

.strike {
    text-decoration: line-through;
    color: lightgray;
}
</style>
