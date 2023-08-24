const taskInput = document.querySelector('.task-input')
const descriptionInput = document.querySelector('.description-input')
const taskDate = document.querySelector('.task-date')
const btnAdd = document.querySelector('.btn-add').addEventListener("click", async e =>{
    e.preventDefault();
    createTask();
} )


async function createTask() {

    let titleInput = taskInput.value;
    let description = descriptionInput.value;
    let date = taskDate.value

    class tareas{
        constructor(titleImput, description, taskDate){
        this.title = titleImput;
        this.description = description;
        this.completed = false
        this.date = taskDate
        }
    }

    const taskInfo = new tareas( titleInput, description, date)

    await PostTask(taskInfo)

}



    async function  PostTask(taskInfo){
        let response = await fetch('http://localhost:3000/tasks', 
        {method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskInfo)
    });
        const responseData = await response.json()
        console.log('Aceptado', responseData)
    }
    

async function getTasks(){
   let result = await fetch('http://localhost:3000/tasks');
   let data = await result.json();
   return data;
}







async function updateTask(id, updatedTask) {
    let response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    });

    const responseData = await response.json();
    console.log('Actualizado', responseData);
}








async function deleteTask(id){
    await fetch(`http://localhost:3000/tasks/${id}`, {method:'DELETE'})
}








let taskList = document.querySelector('.li-container');

async function showTasks() {
    let tasks = await getTasks();
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}</span>
            <div class="description" style="display: none;">${task.description}</div>
            <button class= "edit"><ion-icon name="create-outline"></ion-icon></button>
            <button class="btnDelete" onClick="deleteTask(${task.id})"><ion-icon name="trash-outline"></ion-icon></button>
            <button class="btnOk ${task.completed ? 'completed': ''}"><ion-icon name="checkmark-outline"></ion-icon></button>
            <span class="task-date" style="display: none;">${task.date}</span>
            <button class="btn-date ${task.date}"><ion-icon name="calendar-outline"></ion-icon></button>
            
        `;

        listItem.classList.add('sortable-item')

        const date = listItem.querySelector('.task-date');

        listItem.querySelector('.btn-date').addEventListener('click', () => {
            if (date.style.display === 'none') {
                date.style.display = 'block';
            } else {
                date.style.display = 'none';
            }
        });
        
        
        const editButton = listItem.querySelector('.edit');
        editButton.classList.add('sortable-handle'); // Agrega la clase "sortable-handle" al botón de editar
        editButton.addEventListener('click', () => {
            const taskTitle = listItem.querySelector('.task-title');
            const description = listItem.querySelector('.description');
            
            if (taskTitle.contentEditable !== 'true') {
                taskTitle.contentEditable = 'true';
                description.contentEditable = 'true';
                taskTitle.focus();
                editButton.innerHTML = '<ion-icon name="save-outline"></ion-icon>';
            } else {
                taskTitle.contentEditable = 'false';
                description.contentEditable = 'false';
                editButton.innerHTML = '<ion-icon name="create-outline"></ion-icon>';
                const updatedTask = {
                    title: taskTitle.textContent,
                    description: description.textContent,
                    completed: taskTitle.classList.contains('completed')
                };
                updateTask(task.id, updatedTask);
            }
        });




        listItem.querySelector('.task-title').addEventListener('click', () => {
            const description = listItem.querySelector('.description');
            if (description.style.display === 'none') {
                description.style.display = 'block';
            } else {
                description.style.display = 'none';
            }
        });

        const btnOk = listItem.querySelector('.btnOk');
        btnOk.addEventListener('click', () => {
            const taskTitle = listItem.querySelector('.task-title');
            taskTitle.classList.toggle('completed'); 

            const updatedTask ={
                completed: taskTitle.classList.contains('completed')
            }
        });

        taskList.appendChild(listItem);
    });

    if (tasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Sin tareas pendientes';
        taskList.appendChild(emptyMessage);
    }

    new Sortable(taskList, {
        animation: 150, // Duración de la animación de arrastrar y soltar
        handle: '.sortable-handle', // Selector de elementos que permiten arrastrar (puedes agregar un ícono de arrastrar aquí)
        ghostClass: 'sortable-ghost', // Clase aplicada al elemento fantasma mientras se arrastra
        chosenClass: 'sortable-chosen', // Clase aplicada al elemento elegido para arrastrar
        dragClass: 'sortable-drag' // Clase aplicada al elemento que está siendo arrastrado
    });
}

document.addEventListener("DOMContentLoaded", showTasks);
