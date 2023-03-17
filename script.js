const form = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const todosList = document.getElementById('todosList');
const taskCheckbox = document.getElementById('taskCheckbox');
const editBtn = document.getElementById('editBtn');

// All todos
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let todoIdToBeEdit = -1;

// first render from local storage

// add todos
const addTodo = () =>{
    let todoValue = taskInput.value;
    // check empty
    let isEmpty = todoValue === "";

    // check duplicate
    let isDuplicate = todos.some(todo => todo.task === todoValue)

    if (isEmpty){
        alert("Task can not be empty");
    }

    else if (isDuplicate){
        alert("Task already exists")
    }

    else{
        if(todoIdToBeEdit > -1){
            todos = todos.map((todo, index) => ({
                ...todos,
                task : index === todoIdToBeEdit ? todoValue : todo.task
            }))
            todoIdToBeEdit = -1;
        }

        else{
            todos.push({task : todoValue , checked : false});           
        }
        taskInput.value = '';
    }
    
}

// display all todos
const showTodos = () => {
    todosList.innerHTML = '';

    todos.forEach((todo, index) => {
        todosList.innerHTML += `
                 <div class="pick todo input-group d-flex justify-content-between align-items-center my-1 p-1" id=${index}>
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="pick form-check-label" data-action = "check"  id="${index} taskCheckbox" style="height: 30px;width: 20px;">
                        <div class="mx-1 pick" id="task">${todo.task}</div>                       
                    </div>

                    <div>
                        <button class="pick btn  btn-success" id="${index} editBtn" data-action = "edit">
                           Edit
                        </button>
                        <button class="pick btn btn-danger" id="${index} deleteBtn" data-action = "delete">
                            Delete
                        </button>                        
                    </div>
                </div>`;
    })

}
showTodos();
// check to-do
const checkTodo = (taskId) => {
    todos = todos.map((todo, index) => ({
        ...todos,
        checked : index === taskId ? !todo.checked: todo.checked
    }))

    if(todos[taskId].checked == true){
        document.getElementById(taskId).style.textDecoration = "line-through";
    }
    else{
        document.getElementById(taskId).style.textDecoration = "none";
    }
    
}

// edit to-do
const editTodo = (taskId) => {
    taskInput.value = todos[taskId].task;
    todoIdToBeEdit = taskId;
}

// delete to-do
const deleteTodo = (taskId) => {
    todos = todos.filter((todo, index) => index !== taskId);
    showTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}

// event listeners on todo lists
todosList.addEventListener('click', event => {
    const target = event.target;
    
    // Check if clicked area have class pick in HTML DOM
    let isTodo = target.className.includes("pick");
    let todoId = "";
    
    // finding the id of clicked todo
    if(isTodo){
         let todoIds =target.id.split(" ");
         todoId =Number(todoIds[0]) ;
    }

    // checking data action
    let action = target.dataset.action;
    
    // calling functions on the base of action
    action === 'check' && checkTodo(todoId);
    action === 'edit' && editTodo(todoId);
    action === 'delete' && deleteTodo(todoId); 
    
})

// event listener on forms
form.addEventListener('submit', e => {
    e.preventDefault();
    addTodo();
    showTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
    
})