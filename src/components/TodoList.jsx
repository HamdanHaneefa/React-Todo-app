import React, { useState, useEffect , useRef} from "react";

const TodoList = () => {
  const [task, setTask] = useState(() => {
    const savedTask = localStorage.getItem("tasks")
    return savedTask ? JSON.parse(savedTask) : []
  });

  const inputFocus = useRef(null);

  useEffect(() => {
    inputFocus.current.focus();
  }, []);

  
useEffect(() => {
    function handleDeleteKeyPress(event) {
      if (event.key === "Delete" && task.length > 0) {
        deleteTask(0);
      }
    }

    document.addEventListener("keydown", handleDeleteKeyPress);
    
    return () => {
      document.removeEventListener("keydown", handleDeleteKeyPress);
    };
  }, [task]);


  const [newTask, setNewTask] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  

  useEffect(() => {   
    localStorage.setItem("tasks", JSON.stringify(task));
  }, [task]);



  function handleInput(e) {
    setNewTask(e.target.value);
  }

  function addTask(e) {
    e.preventDefault();
    if(newTask.trim() !== ""){
        setTask([...task,newTask])
        setNewTask("")
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      addTask(event);
    }
  }

  function handleSaveKeyPress(event) {
    if(event.key == "Enter") {
        console.log("here")
        saveEditedTask()
    }
  }

  function deleteTask(index){
    const updatedTasks = task.filter((_,i) => i !== index)
    setTask(updatedTasks)
  }

  function openEditModal(index){
    setEditIndex(index);
    setEditedTask(task[index]);
    setIsModalOpen(true)
  }

  function handleEditInput(e){
    setEditedTask(e.target.value)
  }

  function saveEditedTask(){
    if(editedTask.trim() !== ""){
        const updatedTasks = [...task]
        updatedTasks[editIndex] = editedTask
        setTask(updatedTasks)
        setIsModalOpen(false);
    }
  }

  return (
    <div id="todo-container">
      <h2 className="todo-heading">Todo List</h2>
      <form id="todo-form">
        <input
          onChange={handleInput}
          type="text"
          value={newTask}
          className="todo-input"
          onKeyPress={handleKeyPress}
          placeholder="Enter a task..."
          ref={inputFocus}
        />
        <button onClick={addTask} type="button" className="todo-button">
          Add
        </button>
      </form>

      <ol id="todo-list">
        {task.map((task, index) => (
          <li key={index} className="todo-item">
            <span>{task}</span>
            <button onClick={() => deleteTask(index)} className="delete-button">
              Delete
            </button>
            <button onClick={() => openEditModal(index)} className="edit-button">
              Edit
            </button>
          </li>
        ))}
      </ol>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editedTask}
              onChange={handleEditInput}
              className="edit-input"
              onKeyPress={handleSaveKeyPress}
            />
            <button onClick={saveEditedTask} className="save-button">
              Save
            </button>
            <button onClick={() => setIsModalOpen(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TodoList;
