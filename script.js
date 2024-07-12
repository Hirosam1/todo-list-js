console.log("starting js");
const taskSep = ':';
const pendingColor = '#B15A28';
const doingColor   = '#9A901D';
const doneColor    = '#508932';

//Reference for important objects
let pageHeaderObj = document.getElementById('page-header');
let taskListObj = document.getElementById('task-list');
let newTaskPromptObj = document.getElementById('new-task-prompt');
let newTaskFormObj = document.getElementById('new-task-form');
let deleteTaskPromptObj = document.getElementById('delete-task-prompt');
let deleteTaskSelectObj = document.getElementById('delete-task-select');
let taskNameInptObj = document.getElementById('task-name-inpt');
let taskDescriptionInptObj = document.getElementById('task-description-inpt');

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

let addTask = function(taskName, taskDescription){
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
	+   `<input type="radio" name="task-status-${taskName}" value="pending" checked onChange="onChangeTaskStatus('${taskName}','pending')"/>`
	+ `</div>`
	+ `<div class="fx-col status-choice">`
	+     `<p>Doing</p>`
	+     `<input type="radio" name="task-status-${taskName}" value="doing" onChange="onChangeTaskStatus('${taskName}','doing')"/>`
	+ `</div>`
	+ `<div class="fx-col status-choice" style="padding-right:5px;">`
	+     `<p>Done</p>`
	+     `<input type="radio" name="task-status-${taskName}" value="done" onChange="onChangeTaskStatus('${taskName}','done')"/>`
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

let onChangeTaskStatus = function(taskName, opt){
    let taskObj = getTaskByName(taskName);
    if(taskObj != undefined){
	let statusObj = taskObj.getElementsByClassName('task-status-choices')[0];
	let taskColor = opt === 'pending' ? pendingColor : opt == 'doing' ? doingColor : doneColor;
	statusObj.style.background = taskColor;
    }
}

let onNewTask = function(){
    disableUI();
    //Enables visualization.
    newTaskPromptObj.style.display='block';
}

let onAcceptNewTask = function(){
    let taskName = taskNameInptObj.value;
    let taskDescription = taskDescriptionInptObj.value;
    let findTask = getTaskByName(taskName);
    if(findTask === undefined){
	if(taskName != ""){
	    addTask(taskName, taskDescription);
	}
    }else{
	alert(`Can't create tasks with the same name: ${taskName}`);
	return;
    }
    newTaskFormObj.reset();
    //Disables visualization.
    newTaskPromptObj.style.display='none';
    enableUI();
}

let onCancelNewTask = function(){
    newTaskFormObj.reset();
    newTaskPromptObj.style.display='none';
    enableUI();
}

let onRemoveTask = function(){
    loadRemovableTasksOpts();
    disableUI();
    deleteTaskPromptObj.style.display='block';
    
}

let onAcceptRemoveTask = function(){
    let childObj = getTaskByName(deleteTaskSelectObj.value)
    if(childObj != undefined){
	taskListObj.removeChild(childObj);
	loadRemovableTasksOpts();
    }
}

let onCancelRemoveTask = function(){
    deleteTaskPromptObj.style.display='none';
    enableUI();
}

function createTodo(taskName, taskDesc, taskStatus){
    let todo={};
    todo['taskName'] = taskName;
    todo['taskDesc'] = taskDesc;
    todo['taskStatus'] = taskStatus;
    return todo;
}

let saveTodoList = function(){
    let todoList = [];
    for(let i = 0; i < taskListObj.children.length; i++){
	let child = taskListObj.children[i];
	let taskName = removeSepFromName(child.getElementsByClassName('task-name')[0].innerHTML);
	let taskDesc = child.getElementsByClassName('task-description')[0].innerHTML;
	let taskStatus = child.querySelector(`input[name="task-status-${taskName}"]:checked`);
	if(taskStatus !== null){
	    todoList.push(createTodo(taskName, taskDesc.substr(1,taskDesc.length), taskStatus.value));
	}else{
	    console.log(`Couldn't find query for:\ninput[name="task-status-${taskName}"]:checked`);
	}
    }
    let jsStr = JSON.stringify(todoList, null, 4);
    console.log(`saving todo list:\n${jsStr}`);
}

console.log('js loaded!');
