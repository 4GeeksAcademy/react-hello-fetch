import React, { useState, useEffect } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    createUserIfNeeded(); 
  }, []);

  const createUserIfNeeded = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/stanxlin');
      if (response.status === 404) {
        await createUser();
      }
      fetchTasks();
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/stanxlin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([])
      });

      if (!response.ok) {
        throw new Error('Error creating user: BAD REQUEST');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const fetchTasks = () => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/stanxlin')
      .then(resp => resp.json())
      .then(data => {
        setTasks(data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const addTask = async (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      event.preventDefault();

      try {
        const newTask = { label: inputValue, done: false };
        setTasks([...tasks, newTask]);
        await updateTodoList([...tasks, newTask]);
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
      await updateTodoList(newTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTodoList = async (updatedTasks) => {
    try {
      const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/stanxlin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTasks)
      });

      if (!response.ok) {
        throw new Error('Error updating todo list: BAD REQUEST');
      }
    } catch (error) {
      console.error('Error updating todo list:', error);
    }
  };

  const clearAllTasks = () => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/stanxlin', {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        setTasks([]); 
      } else {
        throw new Error('Error clearing all tasks');
      }
    })
    .catch(error => {
      console.error('Error clearing all tasks:', error);
    });
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
      <button onClick={clearAllTasks}>Limpiar todas las tareas</button>
    </div>
  );
};

export default Home;
