const taskSep = ': ';
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
let editTaskNameInptObj = document.getElementById('edit-task-name-inpt');
let editTaskDescInptObj = document.getElementById('edit-task-description-inpt');
//Prompts
let newTaskPromptObj = document.getElementById('new-task-prompt');
let deleteTaskPromptObj = document.getElementById('delete-task-prompt');
let editTaskPromptObj = document.getElementById('edit-task-prompt');

function createTodo(taskName, taskDesc='', taskStatus='pending'){
    let todo={};
    todo['taskName'] = taskName;
    todo['taskDesc'] = taskDesc;
    todo['taskStatus'] = taskStatus;
    return todo;
}

function clearChilds(arr){
    while(arr.firstChild){
	arr.firstChild.remove();
    }
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

//Namespace for code that writes in the html code.
let htmlGenerator = {}
htmlGenerator.loadRemovableTasksOpts = function(){
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

htmlGenerator.addTask = function(taskName, taskDescription, taskStatus='pending'){
    //Push back HTML for a task
    let taskInstHtml =`<div class="task-inst fx-row">`
	+`<div class="task-definition" onclick="onTaskClick(this);")>`
	+`<p>`
	+`<span class="task-name">${taskName}${taskSep}</span>`
	+`<span class="task-description">${taskDescription}</span>`
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
	+`<div class="move-task fx-col">`
	+`<img src="todo-list/arrow-up1.svg" class="task-arrow" onclick="onMoveUp('${taskName}');" alt="">`
	+`<img src="todo-list/arrow-up1.svg" class="task-arrow flip-x" onclick="onMoveDown('${taskName}');" alt="">`
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

let clickedTaskObj=undefined;
let enablePrompt = function(promptObj){
    promptObj.style.display='block';
    promptObj.style.pointerEvents='auto';
}

let disablePrompt = function(promptObj){
    promptObj.style.display='none';
    promptObj.style.pointerEvents='none';
    clickedTaskObj=undefined;
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

let onTaskClick = function(taskObj){
    let taskName = removeSepFromName(taskObj.getElementsByClassName('task-name')[0].innerHTML);
    clickedTaskObj = taskObj;
    let i = indexOfTaskName(myTodoList, taskName);
    let taskDesc = myTodoList[i]['taskDesc'];
    editTaskNameInptObj.value=taskName;
    editTaskDescInptObj.value=taskDesc;
    disableUI();
    enablePrompt(editTaskPromptObj);
}

let onAcceptEditTask = function(){
    let taskName = removeSepFromName(clickedTaskObj.getElementsByClassName('task-name')[0].innerHTML);
    let newTaskName = editTaskNameInptObj.value;
    let newTaskDesc = editTaskDescInptObj.value;
    let i = indexOfTaskName(myTodoList,taskName);
    if(i!=-1 && newTaskName!=''){
	if(newTaskName === taskName){
	    myTodoList[i]['taskDesc'] = newTaskDesc; 
	}
	else{
	    myTodoList[i]['taskName'] = newTaskName;
	    myTodoList[i]['taskDesc'] = newTaskDesc;
	}
    }
    
    clearChilds(taskListObj);
    loadFromTodoList(myTodoList);
    saveTodoList();
    disablePrompt(editTaskPromptObj);
    enableUI();
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
	    htmlGenerator.addTask(taskName, taskDescription);
	    myTodoList.push(createTodo(taskName, taskDescription));
	    saveTodoList();
	}
    }else{
	alert(`Can't create tasks with the same name: ${taskName}`);
	return;
    }
    newTaskPromptObj.reset();
    //Disables visualization.
    disablePrompt(newTaskPromptObj);
    enableUI();
}

let onCancelNewTask = function(){
    newTaskFormObj.reset();
    disablePrompt(newTaskPromptObj);
    enableUI();
}

let onCancelPrompt = function(promptName){
    let promptObj = document.getElementById(promptName);
    promptObj.reset();
    disablePrompt(promptObj);
    enableUI();
}

let onRemoveTask = function(){
    disableUI();
    htmlGenerator.loadRemovableTasksOpts();
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
	htmlGenerator.loadRemovableTasksOpts();
    }
}

let onCancelRemoveTask = function(){
    disablePrompt(deleteTaskPromptObj);
    enableUI();
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
};

let onMoveUp = function(taskName){
    let i = indexOfTaskName(myTodoList,taskName);
    if(i>=0 && i > 0){
	myTodoList = array_move(myTodoList,i,i-1);
	clearChilds(taskListObj);
	loadFromTodoList(myTodoList);
	saveTodoList();
    }
}

let onMoveDown = function(taskName){
    let i = indexOfTaskName(myTodoList,taskName);
    if(i>=0 && i < myTodoList.length - 1){
	myTodoList = array_move(myTodoList,i,i+1);
	clearChilds(taskListObj);
	loadFromTodoList(myTodoList);
	saveTodoList();
    }
}

let loadFromTodoList = function(todoListArr){
    for(let i=0; i<todoListArr.length; i++){
	let todoInst = todoListArr[i];
	htmlGenerator.addTask(todoInst['taskName'], todoInst['taskDesc'], todoInst['taskStatus']);
	changeTaskColorStat(todoInst['taskName'],todoInst['taskStatus']);
    }
}

let saveTodoList = async function(){
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

//First load functions then start loading content to the page.
//Download todoList from server and load it in the HTML.
downloadTodoList().then(({statusCode, body})=>{myTodoList=body; loadFromTodoList(body);});
