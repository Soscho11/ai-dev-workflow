import React, { useState, useEffect } from 'react';

// In production on Vercel, this points to your Render backend URL.
// In local development, it defaults to '' so Vite's proxy forwards to localhost:5000.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) {
        if (res.status === 500) {
          throw new Error('Backend server is not responding on port 5000. Did you start "npm run dev:server"?');
        }
        throw new Error(`HTTP error ${res.status}: Failed to fetch tasks`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to reach backend. If hosted on Render Free tier, it may be waking up (takes ~30s). Please click Retry in a moment.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      setTitle('');
      setDescription('');
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(task) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!res.ok) throw new Error('Failed to update task status');
      
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, completed: t.completed ? 0 : 1 } : t
      ));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>📋 Task Manager</h1>
        <p style={styles.subtitle}>Antigravity Workflow Practice App (React + Express + MySQL)</p>
      </header>

      {/* Error Alert Banner */}
      {error && (
        <div style={styles.errorBox}>
          <strong>⚠️ Error:</strong> {error}
          <button style={styles.retryBtn} onClick={fetchTasks}>Retry</button>
        </div>
      )}

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} style={styles.form}>
        <h3>Add New Task</h3>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Task Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            disabled={submitting}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            disabled={submitting}
          />
        </div>
        <button type="submit" style={styles.submitBtn} disabled={submitting || !title.trim()}>
          {submitting ? 'Adding...' : '➕ Add Task'}
        </button>
      </form>

      {/* Task List Section */}
      <section style={styles.listSection}>
        <div style={styles.listHeader}>
          <h3>Your Tasks ({tasks.length})</h3>
          <button style={styles.refreshBtn} onClick={fetchTasks} disabled={loading}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p style={styles.loadingText}>⏳ Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p style={styles.emptyText}>No tasks yet! Add your first task above.</p>
        ) : (
          <ul style={styles.list}>
            {tasks.map((task) => (
              <li key={task.id} style={styles.taskCard}>
                <div style={styles.taskInfo}>
                  <input
                    type="checkbox"
                    checked={Boolean(task.completed)}
                    onChange={() => handleToggleStatus(task)}
                    style={styles.checkbox}
                  />
                  <div>
                    <h4 style={{
                      ...styles.taskTitle,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#888' : '#222'
                    }}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p style={styles.taskDesc}>{task.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={styles.deleteBtn}
                  title="Delete task"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '680px',
    margin: '40px auto',
    fontFamily: 'Segoe UI, -apple-system, sans-serif',
    padding: '0 20px',
    color: '#333'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    marginTop: '6px'
  },
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ffcdd2'
  },
  retryBtn: {
    backgroundColor: '#c62828',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  form: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    marginBottom: '30px'
  },
  formGroup: {
    marginBottom: '12px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  submitBtn: {
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  listSection: {
    marginTop: '20px'
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  refreshBtn: {
    background: 'none',
    border: '1px solid #ced4da',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  loadingText: {
    textAlign: 'center',
    color: '#666'
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  taskCard: {
    backgroundColor: '#fff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '14px 18px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
  },
  taskInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  taskTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600'
  },
  taskDesc: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#666'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    opacity: 0.7
  }
};

