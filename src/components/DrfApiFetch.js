import React, { useState, useEffect } from "react";
import axios from "axios";

const DrfApiFetch = () => {
  const headers = {
    headers: {
      Authorization: "Token 1ebc85985efa3dd758115213bb2a0e47ff957d98",
    },
  };

  const [tasks, setTasks] = useState([]);
  const [selectedtask, setSelectedtask] = useState([]);
  const [editedTask, setEditedTask] = useState({ id: "", title: "" });
  const [id, setId] = useState(1);

  // 初回読み込み
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/tasks/", headers)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.log("空です"));
  }, []);

  // read
  const getTask = () => {
    axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, headers).then((res) => {
      setSelectedtask(res.data);
    });
  };

  // delete
  const deleteTask = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/tasks/${id}/`, headers)
      .then((res) => {
        setTasks(tasks.filter((task) => task.id !== id));
        setSelectedtask([]);
        if (editedTask.id === id) {
          setEditedTask({ id: "", title: "" });
        }
      });
  };

  // create
  const newTask = (task) => {
    const data = {
      title: task.title,
    };
    axios
      .post("http://127.0.0.1:8000/api/tasks/", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 1ebc85985efa3dd758115213bb2a0e47ff957d98",
        },
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setEditedTask({ id: "", title: "" });
      });
  };

  // update
  const editTask = (task) => {
    axios
      .put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 1ebc85985efa3dd758115213bb2a0e47ff957d98",
        },
      })
      .then((res) => {
        setTasks(
          tasks.map((task) => (task.id === editedTask.id ? res.data : task))
        );
        setEditedTask({ id: "", title: "" });
      });
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditedTask({ ...editedTask, [name]: value });
  };

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} {task.id}
            <button onClick={() => deleteTask(task.id)}>
              <i className="fas fa-trash-alt" />
            </button>
            <button onClick={() => setEditedTask(task)}>
              <i className="fas fa-pen" />
            </button>
          </li>
        ))}
      </ul>
      {/* idの入力 */}
      <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      <br />
      <button type="button" onClick={() => getTask()}>
        get task
      </button>
      <h3>
        {selectedtask.title} {selectedtask.id}
      </h3>
      <input
        type="text"
        name="title"
        value={editedTask.title}
        onChange={(e) => handleInputChange(e)}
        placeholder="New Task ?"
        required
      />
      {editedTask.id ? (
        <button onClick={() => editTask(editedTask)}>update</button>
      ) : (
        <button onClick={() => newTask(editedTask)}>Create</button>
      )}
    </div>
  );
};

export default DrfApiFetch;
