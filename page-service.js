const {readFile, writeFile} = require('fs').promises;
const express = require('express');
const bodyParser = require('body-parser');

module.exports = class PageService{
    constructor(){
	this.app = express();
	this.jsonParser = bodyParser.json();
	this.resources = {};
    };

    linkPageLive(filePath, requestName, mimeType){
	this.app.get(requestName, async (_, resp) =>{
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
    };

    async linkPageStatic(filePath, requestName, mimeType){
	try{
	    this.resources[filePath] = await readFile(filePath);
	}catch(erorr){
	    console.log('Error while reading from file: ' + erorr);
	}
	this.app.get(requestName, (_, resp) =>{
	    try{
		resp.status(200);
		resp.set('Content-Type', mimeType);
		resp.send(this.resources[filePath]);
	    }catch(error){
		console.log('ERROR while loading page:');
		console.log(error);
		resp.sendStatus(500);
	    }
	});
    };

    linkPageService(servicePath, method,parser, service){
	let linker = null;
	if(parser==='json'){
	    parser = this.jsonParser;
	}
	this.app[method](servicePath, parser, service);
    }

    listen(homePage=''){
	this.app.listen(process.env.PORT || 3000, () =>
			console.log(`App available on: http://localhost:3000${homePage}`));
    }
};
