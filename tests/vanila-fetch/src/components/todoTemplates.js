// heading template
export const counter_heading_template = function ({ done, len }) {
    return `<h3>
        Done ${done} of ${len}
        <i>&#8592; full page after H1 is re-rendering after checkbox change</i>
    </h3>`;
};

// todo template
export const todo_template = function (data) {
    return `<li>
        <input
            type="checkbox"
            id="${data.id}"
            ${data.completed ? 'checked=true' : ''}
        />
        <label for="${data.id}" class="${data.completed && 'strike'}">
            ${data.title}
        </label>
    </li>`;
};

export const add_new_todo = function () {
    return `
    <input id="newTodo" type="text" placeholder="type in todo">
    <button type="submit">Add</button>
`
}

export const get_completed_todos = function (timeout, completedTodos) {
    return `
    <button id="getCompleted">Get completed todos</button>
    ${!timeout ?
            `<span>${completedTodos.map(item => item.id)}</span>` :
            '<span style="color:red"> Timeout Abort...</span>'
        }
    `
}