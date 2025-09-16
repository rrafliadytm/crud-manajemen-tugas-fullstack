// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Kita akan buat file CSS sederhana ini nanti

// Ambil URL API dari environment variable
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 1. Fungsi untuk mengambil semua data tugas dari API
  const fetchTasks = () => {
    axios.get(`${API_URL}/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  };

  // 2. Gunakan useEffect untuk menjalankan fetchTasks() saat komponen pertama kali dimuat
  useEffect(() => {
    fetchTasks();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat mount

  // 3. Fungsi untuk menangani penambahan tugas baru
  const handleAddTask = (e) => {
    e.preventDefault(); // Mencegah form dari reload halaman
    if (!newTaskTitle.trim()) return; // Jangan tambah jika input kosong

    axios.post(`${API_URL}/tasks`, { title: newTaskTitle })
      .then(() => {
        fetchTasks(); // Ambil ulang data tugas agar daftar ter-update
        setNewTaskTitle(''); // Kosongkan kembali input form
      })
      .catch(error => console.error("Error adding task:", error));
  };

  // 4. Fungsi untuk mengubah status selesai/belum selesai (toggle)
  const handleToggleTask = (task) => {
    const updatedTask = { ...task, is_completed: !task.is_completed };
    
    // Asumsi endpoint update Anda adalah PUT /api/tasks/{id}
    // Filament Resource secara otomatis membuat endpoint ini
    axios.put(`${API_URL}/tasks/${task.id}`, updatedTask)
      .then(() => fetchTasks())
      .catch(error => console.error("Error updating task:", error));
  };

  // 5. Fungsi untuk menghapus tugas
  const handleDeleteTask = (taskId) => {
    axios.delete(`${API_URL}/tasks/${taskId}`)
      .then(() => fetchTasks())
      .catch(error => console.error("Error deleting task:", error));
  };

  // 6. Fungsi untuk menandai tugas sebagai selesai
  const handleCompleteTask = (taskId) => {
    const updatedTask = { ...taskId, is_completed: true };

    axios.put(`${API_URL}/tasks/${taskId.id}`, updatedTask)
      .then(() => fetchTasks())
      .catch(error => console.error("Error completing task:", error));
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>📝 Daftar Tugas</h1>
      </div>

      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Apa yang akan Anda kerjakan?"
        />
        <button type="submit">Tambah</button>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
            <span onClick={() => handleToggleTask(task)}>
              {task.title}
            </span>
            <button onClick={() => handleCompleteTask(task)} className="complete-btn">
              Selesai
            </button>
            <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;