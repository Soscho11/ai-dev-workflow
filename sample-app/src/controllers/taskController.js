import { dbQuery } from '../config/db.js';

/**
 * GET /api/tasks
 * Fetch all tasks
 */
export async function getTasks(req, res, next) {
  try {
    const tasks = await dbQuery('SELECT id, title, description, completed, created_at FROM tasks ORDER BY id DESC');
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks/:id
 * Fetch single task by ID
 */
export async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;
    const tasks = await dbQuery('SELECT id, title, description, completed, created_at FROM tasks WHERE id = ?', [id]);
    
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: `Task with id ${id} not found.` });
    }
    
    res.status(200).json(tasks[0]);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function createTask(req, res, next) {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required and must not be empty.' });
    }

    const cleanTitle = title.trim();
    const cleanDesc = description ? description.trim() : '';

    const result = await dbQuery(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [cleanTitle, cleanDesc]
    );

    res.status(201).json({
      id: result.insertId,
      title: cleanTitle,
      description: cleanDesc,
      completed: 0,
      message: 'Task created successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/tasks/:id
 * Toggle or update task completion status
 */
export async function updateTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (completed === undefined) {
      return res.status(400).json({ message: 'Field "completed" (boolean) is required.' });
    }

    const isCompleted = completed ? 1 : 0;
    const result = await dbQuery('UPDATE tasks SET completed = ? WHERE id = ?', [isCompleted, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Task with id ${id} not found.` });
    }

    res.status(200).json({ id: Number(id), completed: isCompleted, message: 'Task updated successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const result = await dbQuery('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Task with id ${id} not found.` });
    }

    res.status(200).json({ id: Number(id), message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

