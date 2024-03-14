import React, { useState, useEffect } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/Diana024')
      .then(resp => resp.json())
      .then(data => {
        setTasks(data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const updateTodoList = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/Diana024', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
      });

      if (!response.ok) {
        throw new Error('Error updating todo list: BAD REQUEST');
      }
    } catch (error) {
      console.error('Error updating todo list:', error);
    }
  };

  const addTask = async (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      event.preventDefault();

      try {
        const newTask = { label: inputValue, done: false };
        setTasks([...tasks, newTask]);

        await updateTodoList();

        setInputValue('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleTaskDelete = async (index) => {
    try {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);

      await updateTodoList();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>
      <input
        type="text"
        id="taskInput"
        placeholder="Agregar nueva tarea..."
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={addTask}
      />
      <ul id="taskList">
        {tasks.length === 0 ? (
          <li>No hay tareas, añadir tareas</li>
        ) : (
          tasks.map((task, index) => (
            <li key={index} onMouseEnter={() => (document.getElementById(`task-${index}`).style.display = "block")} onMouseLeave={() => (document.getElementById(`task-${index}`).style.display = "none")}>
              {task.label}
              <i id={`task-${index}`} className="fas fa-trash-alt" style={{ display: "none" }} onClick={() => handleTaskDelete(index)}></i>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
