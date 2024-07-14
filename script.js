const taskSep = ':';
const pendingColor = '#B15A28';
const doingColor   = '#9A901D';
const doneColor    = '#508932';

//Reference for important objects
let pageHeaderObj = document.getElementById('page-header');
let taskListObj = document.getElementById('task-list');
let newTaskFormObj = document.getElementById('new-task-form');
let deleteTaskSelectObj = document.getElementById('delete-task-select');
let taskNameInptObj = document.getElementById('task-name-inpt');
let taskDescriptionInptObj = document.getElementById('task-description-inpt');
//Prompts
let newTaskPromptObj = document.getElementById('new-task-prompt');
let deleteTaskPromptObj = document.getElementById('delete-task-prompt');

function createTodo(taskName, taskDesc='', taskStatus='pending'){
    let todo={};
    todo['taskName'] = taskName;
    todo['taskDesc'] = taskDesc;
    todo['taskStatus'] = taskStatus;
    return todo;
}

function indexOfTaskName(todoList, taskName){
    for(let i=0;i<todoList.length;i++){
	if(myTodoList[i]['taskName']===taskName){
	    return i;
	}
    }
    return -1;
}

let myTodoList = [];

let removeSepFromName = function(taskNameFull){
    return taskNameFull.substring(0,taskNameFull.length-taskSep.length);
}

let getTaskByName = function(taskName){ 
    for(let i=0; i<taskListObj.children.length; i++){
	let childObj = taskListObj.children[i];
	let taskNameAux = childObj.getElementsByClassName('task-name')[0];
	let taskNameStr = removeSepFromName(taskNameAux.innerHTML);
	if(taskNameStr === taskName){
	    return taskListObj.children[i];
	}
    }
    return undefined;
}

let loadRemovableTasksOpts = function(){
    let optionsHtml = ''
    if (taskListObj.children.length > 0){
	for(let i = 0; i < taskListObj.children.length; i++){
	    let taskName = taskListObj.children[i].getElementsByClassName('task-name');
	    //For each element on taskList create an html line as option for deletion.
	    if(taskName.length > 0){
		let taskNameStr = taskName[0].innerHTML;
		taskNameStr = removeSepFromName(taskNameStr);
		optionsHtml += `<option value='${taskNameStr}'>${taskNameStr}</option>`
	    }
	}
    }else{
	//Return only this option when the list is empty.
	optionsHtml += `<option value='NONE'>NONE</option>`
    }
    deleteTaskSelectObj.innerHTML = optionsHtml;
}

let addTask = function(taskName, taskDescription, taskStatus='pending'){
    //Push back HTML for a task
    let taskInstHtml =`<div class="task-inst fx-row">`
	+`<div class="task-definition">`
	+`<p>`
	+`<span class="task-name">${taskName}${taskSep}</span>`
	+`<span class="task-description"> ${taskDescription}</span>`
	+`</p>`
	+`</div>`
	+`<div class="v-separator" style="width:15px"></div>`
	+`<div class="task-status-choices fx-row" style="background:${pendingColor};">`
	+` <div class="fx-col status-choice">`
	+   `<p>Pending</p>`
	+   `<input type="radio" name="task-status-${taskName}" value="pending" ${taskStatus==='pending'?'checked':''} checked onChange="onChangeTaskStatus('${taskName}','pending')"/>`
	+ `</div>`
	+ `<div class="fx-col status-choice">`
	+     `<p>Doing</p>`
	+     `<input type="radio" name="task-status-${taskName}" value="doing" ${taskStatus==='doing'?'checked':''} onChange="onChangeTaskStatus('${taskName}','doing')"/>`
	+ `</div>`
	+ `<div class="fx-col status-choice" style="padding-right:5px;">`
	+     `<p>Done</p>`
	+     `<input type="radio" name="task-status-${taskName}" value="done" ${taskStatus==='done'?'checked':''} onChange="onChangeTaskStatus('${taskName}','done')"/>`
	+ `</div>`
	+`</div>`
	+`</div>`;
    //Appending html code like this, prevents reset the input status of radio buttons.
    let taskInstObj = document.createElement('template')
    taskInstObj.innerHTML = taskInstHtml;
    taskListObj.appendChild(taskInstObj.content.children[0]);
}

let disableUI = function(){
    //Disable UI for elements arent prompt.
    pageHeaderObj.style.pointerEvents='none';
    taskListObj.style.pointerEvents='none';
}

let enableUI = function(){
    //Enable UI for elements arent prompt.
    pageHeaderObj.style.pointerEvents='auto';
    taskListObj.style.pointerEvents='auto';
}

let enablePrompt = function(promptObj){
    promptObj.style.display='block';
    promptObj.style.pointerEvents='auto';
}

let disablePrompt = function(promptObj){
    promptObj.style.display='none';
    promptObj.style.pointerEvents='none';
}

let changeTaskColorStat = function(taskName, opt){
    let taskObj = getTaskByName(taskName);
    if(taskObj != undefined){
	let statusObj = taskObj.getElementsByClassName('task-status-choices')[0];
	let taskColor = opt === 'pending' ? pendingColor : opt == 'doing' ? doingColor : doneColor;
	statusObj.style.background = taskColor;
	return true;
    }
    return false;
}

let onChangeTaskStatus = function(taskName, opt){
    let i = indexOfTaskName(myTodoList,taskName);
    if(i!=-1){
	myTodoList[i]['taskStatus']=opt;
	changeTaskColorStat(taskName, opt);
	saveTodoList();
    }
}

let onNewTask = function(){
    disableUI();
    enablePrompt(newTaskPromptObj);
}

let onAcceptNewTask = function(){
    let taskName = taskNameInptObj.value;
    let taskDescription = taskDescriptionInptObj.value;
    let findTask = getTaskByName(taskName);
    if(findTask === undefined){
	if(taskName != ""){
	    addTask(taskName, taskDescription);
	    myTodoList.push(createTodo(taskName, taskDescription));
	    saveTodoList();
	}
    }else{
	alert(`Can't create tasks with the same name: ${taskName}`);
	return;
    }
    newTaskFormObj.reset();
    //Disables visualization.
    newTaskPromptObj.style.display='none';
    disablePrompt(newTaskPromptObj);
    enableUI();
}

let onCancelNewTask = function(){
    newTaskFormObj.reset();
    newTaskPromptObj.style.display='none';
    disablePrompt(newTaskPromptObj);
    enableUI();
}

let onRemoveTask = function(){
    disableUI();
    loadRemovableTasksOpts();
    enablePrompt(deleteTaskPromptObj);
}

let onAcceptRemoveTask = function(){
    let taskName = deleteTaskSelectObj.value;
    let childObj = getTaskByName(taskName);
    let i = indexOfTaskName(myTodoList,taskName);
    if(childObj != undefined & i!=-1){
	taskListObj.removeChild(childObj);
	myTodoList.splice(i,1);
	saveTodoList();
	loadRemovableTasksOpts();
    }
}

let onCancelRemoveTask = function(){
    disablePrompt(deleteTaskPromptObj);
    enableUI();
}

let saveTodoList = async function(){
    let todoList = [];
 //    for(let i = 0; i < taskListObj.children.length; i++){
	// let child = taskListObj.children[i];
	// let taskName = removeSepFromName(child.getElementsByClassName('task-name')[0].innerHTML);
	// let taskDesc = child.getElementsByClassName('task-description')[0].innerHTML;
	// let taskStatus = child.querySelector(`input[name="task-status-${taskName}"]:checked`);
	// if(taskStatus !== null){
	//     todoList.push(createTodo(taskName, taskDesc.substring(1,taskDesc.length), taskStatus.value));
	// }else{
	//     console.log(`Couldn't find query for:\ninput[name="task-status-${taskName}"]:checked`);
	// }
 //    }
    let jsStr = JSON.stringify(myTodoList);
    let resp = await fetch('/todo-list/save-todolist',{
	    method: 'POST',
	    headers: {'Content-Type': 'application/json'},
	    body:jsStr});
    if(resp.status === 200){
    }else{
	alert("Couldn't sync todo list");
    }

}

let downloadTodoList = async function(){
    let resp = await fetch('/todo-list/load-todolist') 
    let statusCode = resp.status;
    let body = await resp.json();
    return {statusCode, body};
}

let loadFromTodoList = function(todoListArr){
    for(let i=0; i<todoListArr.length; i++){
	let todoInst = todoListArr[i];
	addTask(todoInst['taskName'], todoInst['taskDesc'], todoInst['taskStatus']);
	changeTaskColorStat(todoInst['taskName'],todoInst['taskStatus']);
    }
}
//First load functions then start loading content to the page.
//Download todoList from server and load it in the HTML.
downloadTodoList().then(({statusCode, body})=>{myTodoList=body; loadFromTodoList(body);});
