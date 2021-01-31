import '../assets/css/global.css';
import App from './components/App';

const todo = new App({ target: 'todos' }).on('ready', function () {
    this.render();
});

// const todo = new App({ target: 'todos' });
// todo.on('ready', todo.render);

