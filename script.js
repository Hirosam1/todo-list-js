console.log("starting js");
const taskSep = ':';
const pendingColor = '#B15A28';
const doingColor   = '#9A901D';
const doneColor    = '#508932';

let taskListObj = document.getElementById('task-list');
let newTaskPromptObj = document.getElementById('new-task-prompt');
let newTaskFormObj = document.getElementById('new-task-form');
let deleteTaskPromptObj = document.getElementById('delete-task-prompt');
let deleteTaskSelectObj = document.getElementById('delete-task-select');
let taskNameInptObj = document.getElementById('task-name-inpt');
let taskDescriptionInptObj = document.getElementById('task-description-inpt');

let loadedInsts = 0;
let getTaskByName = function(taskName){ for(let i=0; i<taskListObj.children.length; i++){
	let childObj = taskListObj.children[i];
	let taskNameAux = childObj.getElementsByClassName('task-name')[0];
	let taskNameStr = taskNameAux.innerHTML.substring(0,taskNameAux.innerHTML.length-taskSep.length);
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
	    if(taskName.length > 0){
		let taskNameStr = taskName[0].innerHTML;
		taskNameStr = taskNameStr.substring(0,taskNameStr.length - taskSep.length);
		optionsHtml += `<option value='${taskNameStr}'>${taskNameStr}</option>`
	    }
	}
    }else{
	optionsHtml += `<option value='NONE'>NONE</option>`
    }
    deleteTaskSelectObj.innerHTML = optionsHtml;
}

let addTask = function(taskName, taskDescription){
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
	+   `<input type="radio" name="task-status${loadedInsts}" checked onChange="onChangeTaskStatus('${taskName}','pending')"/>`
	+ `</div>`
	+ `<div class="fx-col status-choice">`
	+     `<p>Doing</p>`
	+     `<input type="radio" name="task-status${loadedInsts}" onChange="onChangeTaskStatus('${taskName}','doing')"/>`
	+ `</div>`
	+ `<div class="fx-col status-choice" style="padding-right:5px;">`
	+     `<p>Done</p>`
	+     `<input type="radio" name="task-status${loadedInsts}" onChange="onChangeTaskStatus('${taskName}','done')"/>`
	+ `</div>`
	+`</div>`
	+`</div>`;
    taskListObj.innerHTML +=taskInstHtml; 
    loadedInsts+=1;
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
    newTaskPromptObj.style.display='none';
}

let onCancelNewTask = function(){
    newTaskFormObj.reset();
    newTaskPromptObj.style.display='none';
}

let onRemoveTask = function(){
    loadRemovableTasksOpts();
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
}

console.log('js loaded!');
