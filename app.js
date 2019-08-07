const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

let editingTodo;
let todos = [
	{
		id: 'todo-1',
		todo: 'sdf'
	}, {
		id: 'todo-2',
		todo: 'go to somewhere'
	}
];
function increaseId(str) {
    let arr = str.split('-');
    let newArr = [arr[0], ++arr[1]];
    return newArr.join('-');
}

function makeTodo(name) {
	let lastTodoId;
	if(todos.length) {
		lastTodoId = todos[todos.length - 1].id;
	} else {
        lastTodoId = 'todo-1';
	}
	return {
		id: increaseId(lastTodoId),
		todo: name,
	}
}

app.get('/', (req, res) => {
	res.render('index')
});
app.get('/getTodos', (req, res) => {
	res.send(todos);
});
app.get('/edit', (req, res) => {
	if(editingTodo) {
        res.render('edit', {
            todo: editingTodo
        });
        editingTodo = null;
	} else {
		res.redirect('/')
	}

});
app.put('/edit', (req, res) => {
	editingTodo = req.body;
	res.end();
});
app.post('/', (req, res) => {
	if(req.body.todo === '') {
        res.redirect('/');
        res.end();
        return;
	}
	todos.push(makeTodo(req.body.todo));
	res.redirect('/');
});
app.delete('/:id', (req, res) => {
	const todoId = req.params.id;

	const todo = todos.find(todo => {
		return todo.id === todoId;
	});
	const todoIndex = todos.indexOf(todo);
	todos.splice(todoIndex, 1);
	res.json(todos);
});
app.post('/saveEdition', (req, res) => {
	console.log(req.body);
	let editedTodo = req.body;

    const todo = todos.find(todo => {
        return todo.id === editedTodo.id;
    });
    todo.todo = editedTodo.todo;
	res.redirect('/');
});
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
	console.log('Server is listening...')
});