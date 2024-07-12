console.log('Starting server...');
const {EventEmitter} = require('events');
const {readFile} = require('fs').promises;

function linkPage(app, filePath, requestName, mimeType){
	app.get(requestName, async (req, resp) =>{
	const data = await readFile(filePath, 'utf8');
	resp.set('Content-Type', mimeType);
	resp.send(data);
    });
}

//Link save service.
function saveTodoList(toDoJson){
    //Save todo list;
    console.log(toDoJson);
}

const express = require('express');
const app = express();

const homePage = '/todo-list';
linkPage(app, './index.html', `${homePage}`, 'text/html');
linkPage(app, './style.css',  `${homePage}/style.css`,'text/css');
linkPage(app, './script.js',  `${homePage}/script.js`, 'text/javascript');

// app.get('/save-todolist');

console.log('Server loaded...');
app.listen(process.env.PORT || 3000, () => console.log(`App available on: http://localhost:3000${homePage}`));
