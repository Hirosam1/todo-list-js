console.log('Starting server...');
// const {EventEmitter} = require('events');
const {readFile, writeFile} = require('fs').promises;
const express = require('express');
const bodyParser = require('body-parser');

function linkPage(app, filePath, requestName, mimeType){
	app.get(requestName, async (_, resp) =>{
	try{
	    const data = await readFile(filePath);
	    resp.status(200);
	    resp.set('Content-Type', mimeType);
	    resp.send(data);
	}catch(error){
	    console.log('ERROR while loading page:');
	    console.log(error);
	    resp.sendStatus(500);
	}
    });
}

//Link save service.
const app = express();
const jsonParser = bodyParser.json();

//Route all web-page resources.
const homePage = '/todo-list';
linkPage(app, './index.html', `${homePage}`, 'text/html');
linkPage(app, './style.css',  `${homePage}/style.css`,'text/css');
linkPage(app, './script.js',  `${homePage}/script.js`, 'text/javascript');
linkPage(app, './writing.png',`${homePage}/writing.png`, 'image/png');
linkPage(app, './day-night.png',`${homePage}/day-night.png`, 'image/png');

//Web-service for loading the todolist for server memory.
app.get(`${homePage}/load-todolist`, jsonParser, async (req, resp)=>{
    console.log('uploading todolist...');
    const data = await readFile('./todo-list-save.js', 'utf8');
    resp.set('Content-Type', 'application/json');
    resp.send(data);
});

//Web-service for saving the todolist on the server memory. We expect the POST command.
//We expect a json file as the body, so we use the jsonParsr.
app.post(`${homePage}/save-todolist`, jsonParser, async(req, resp)=>{
    console.log('saving todolist...');
    let postStr = JSON.stringify(req.body, null, 4);
    await writeFile('./todo-list-save.js', postStr); 
    resp.sendStatus(200);
});

console.log('Server loaded...');
app.listen(process.env.PORT || 3000, () => console.log(`App available on: http://localhost:3000${homePage}`));
