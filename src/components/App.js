import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';
import Task from './Task';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [taskObj, setTaskObj] = useState({});

  const handleAdd = () => {
    if (!commonValidate()) {
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          userId: 1,
          title: title,
          completed: false
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((response) => response.json())
        .then((json) => {
          const task = todos.reduce((prev, current) => { return (prev && prev.id > current.id) ? prev : current });
          json.id = task.id + 1;
          todos.unshift(json);
          setTitle('');
          setTodos(todos);
        });
    }
  }

  const handleUpdate = () => {
    if (!commonValidate()) {
      taskObj.title = title;
      setTaskObj(taskObj);
      fetch(`https://jsonplaceholder.typicode.com/todos/${taskObj.id}`, {
        method: 'PUT',
        body: JSON.stringify(taskObj),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((response) => response.json())
        .then((json) => {
          const addBtn = document.getElementById("addBtn");
          const updateBtn = document.getElementById("updateBtn");
          const index = todos.findIndex(t => t.id === json.id);
          todos[index] = json;
          setTitle('');
          setTodos(todos);
          setTaskObj({});
          addBtn.style.display = "block";
          updateBtn.style.display = "none";
        }).catch((err) => {
          const addBtn = document.getElementById("addBtn");
          const updateBtn = document.getElementById("updateBtn");
          const index = todos.findIndex(t => t.id === taskObj.id);
          todos[index] = taskObj;
          setTitle('');
          setTodos(todos);
          setTaskObj({});
          addBtn.style.display = "block";
          updateBtn.style.display = "none";
        });
    }
  }

  const handleCompleted = (id, completed) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: completed
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json())
      .then((json) => {
        const index = todos.findIndex(t => t.id === id);
        let newObj = todos[index];
        newObj.completed = completed;
        todos[index] = newObj;
        setTodos(todos);
      });
  }

  const handleDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',
    }).then((response) => response.json())
      .then((json) => {
        const updatedTodos = todos.filter(t => t.id !== id);
        setTodos(updatedTodos);
      });
  }

  const handleEdit = (obj) => {
    const addBtn = document.getElementById("addBtn");
    const updateBtn = document.getElementById("updateBtn");
    setTitle(obj.title);
    setTaskObj(obj);
    addBtn.style.display = "none";
    updateBtn.style.display = "block";
  }

  const commonValidate = () => {
    if (title === '') {
      toast.error("Please add a task", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => setTodos(json));
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="formDiv">
        <h1>What's the Plan for Today?</h1>
        <div className="input-group">
          <input type="text" className="input" id="title" name="title" placeholder="Add a task" autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="button--submit" id="addBtn" value="Add" type="button" onClick={handleAdd} />
          <input className="button--submit" id="updateBtn" value="Update" type="button" onClick={handleUpdate} />
        </div>
      </div>
      <div className="taskListDiv">
        {todos.map((todo) => (
          <Task key={todo.id} todo={todo} handleCompleted={handleCompleted} handleEdit={handleEdit} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default App;
