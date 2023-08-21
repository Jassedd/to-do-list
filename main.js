const taskInput = document.querySelector('.task-input')
const descriptionInput = document.querySelector('.description-input')
const btnAdd = document.querySelector('.btn-add').addEventListener("click", async e =>{
    e.preventDefault();
    createTask();
    
} )


async function createTask() {

    let titleInput = taskInput.value;
    let description = descriptionInput.value;

    class tareas{
        constructor(titleImput, description){
        this.title = titleImput;
        this.description = description;
        }
    }

    const taskInfo = new tareas( titleInput, description)

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







async function updateTask(id, task){

}








async function deleteTask(id){
    await fetch(`http://localhost:3000/tasks/${id}`, {method:'DELETE'})
}








let taskList = document.querySelector('.li-container');

async function showTasks() {
    let tasks = await getTasks();
    taskList.innerHTML = ''; // Limpiamos el contenido actual

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="task-title">${task.title}</span>
            <div class="description" style="display: none;">${task.description}</div>
            <button class= "edit"><ion-icon name="create-outline"></ion-icon></button>
            <button class="btnDelete" onClick="deleteTask(${task.id})"><ion-icon name="trash-outline"></ion-icon></button>
            <button class="btnOk"><ion-icon name="checkmark-outline"></ion-icon></button>
        `;

        

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
        });

        taskList.appendChild(listItem);
    });

    if (tasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Sin tareas pendientes';
        taskList.appendChild(emptyMessage);
    }
}

document.addEventListener("DOMContentLoaded", showTasks);
