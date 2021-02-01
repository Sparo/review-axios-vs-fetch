const express = require('express')
var bp = require('body-parser');
const cors = require('cors');

const data = require('./data/todos');

const app = express()
const port = 3000

app.use(cors());
app.use(bp.json()); // support json encoded bodies
app.use(bp.urlencoded({ extended: true }));

app.use('/vanila-fetch', express.static('tests/vanila-fetch/dist'));
app.use('/vanila-axios', express.static('tests/vanila-axios/dist'));
app.use('/svelte-fetch', express.static('tests/svelte-fetch/public'));
app.use('/svelte-axios', express.static('tests/svelte-axios/public'));
app.use('/vue-fetch', express.static('tests/vue-fetch/dist'));
app.use('/vue-axios', express.static('tests/vue-axios/dist'));

app.use('/', express.static('public'));

// get todos
app.get('/todos', (req, res) => {
    res.json(data);
});
app.get('/todos/completed', (req, res) => {
    console.log('=================');
    console.log('seconds - ', new Date().getSeconds());
    setTimeout(() => {
        console.log('seconds - ', new Date().getSeconds());
        res.json(data.filter(item => item.completed));
        console.log('=================');
    }, 2000);
});

// get todos
app.get('/todo/:id', (req, res) => {
    const todoid = req.params.id;
    let todo = null;

    if (todoid) {
        todo = data.find(item => item.id == todoid);
    }
    res.json(todo);
});
app.put('/todo/:id', (req, res) => {
    const todoid = req.params.id;
    const todoData = req.body;

    console.log('=================');
    console.log(todoid);
    console.log(todoData);
    console.log('=================');

    if (todoid && todoData) {
        const todoindex = data.findIndex(item => item.id == todoid);
        data[todoindex] = todoData;
    }

    res.json(data);
});
// set new todo
app.post('/todo', (req, res) => {
    const newTodo = req.body;

    console.log('====== POST =====');
    console.log(newTodo);
    console.log('=================');

    data.push(newTodo);
    res.json(data);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})