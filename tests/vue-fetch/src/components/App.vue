<template>
    <div id="vue">
        <button @click="back">Back</button>

        <Loader v-if="showLoader" />
        <div>
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
    components: {
        Loader
    },
    data() {
        return {
            todos: []
        };
    },
    async mounted() {
        this.todos = await this.$api.fetch('/todos');
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
                }
            });
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
