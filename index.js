console.log('Starting server...');
// const {EventEmitter} = require('events');
const {readFile, writeFile} = require('fs').promises;
const PageService = require('./page-service');

let pageType = process.argv[2];
if(pageType === undefined || (pageType!='static' && pageType!='live')){
    pageType = 'live';
}
console.log('Running server as: '+ pageType);
const homePage = '/todo-list';
let appService = new PageService();
let linkType = pageType === 'static'?'linkPageStatic':'linkPageLive';
//Route all web-page resources (URI).
appService[linkType]('./index.html', `${homePage}`, 'text/html');
appService[linkType]('./style.css',  `${homePage}/style.css`,'text/css');
appService[linkType]('./script.js',  `${homePage}/script.js`, 'text/javascript');
appService[linkType]('./todo-list-icon.svg',`${homePage}/todo-list-icon.svg`, 'image/svg+xml');
appService[linkType]('./arrow-up.svg',`${homePage}/arrow-up.svg`, 'image/svg+xml');
appService[linkType]('./arrow-up1.svg',`${homePage}/arrow-up1.svg`, 'image/svg+xml');
appService[linkType]('./day-night.svg',`${homePage}/day-night.svg`, 'image/svg+xml');

//Web-service for loading the todolist for server memory.
appService.linkPageService(`${homePage}/load-todolist`,'get','json',async (req, resp)=>{
    const data = await readFile('./todo-list-save.js', 'utf8');
    resp.set('Content-Type', 'application/json');
    resp.send(data);
});

//Web-service for saving the todolist on the server memory. We expect the POST command.
//We expect a json file as the body, so we use the jsonParsr.
appService.linkPageService(`${homePage}/save-todolist`,'post','json', async(req, resp)=>{
    let postStr = JSON.stringify(req.body, null, 4);
    await writeFile('./todo-list-save.js', postStr); 
    resp.sendStatus(200);
});

console.log('Server loaded...');
appService.listen(homePage);
