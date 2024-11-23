import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function TaskManagement({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    priority: 'medium',
    progress: 0,
    assignedTo: ''
  });
  const [newNote, setNewNote] = useState({ content: '' });
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'notes'

  useEffect(() => {
    fetchTasks();
    fetchNotes();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/tasks`,
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', progress: 0, assignedTo: '' });
      document.getElementById('add-task-form').classList.add('hidden');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/notes`,
        newNote,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotes([...notes, response.data]);
      setNewNote({ content: '' });
      document.getElementById('add-note-form').classList.add('hidden');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskProgressChange = async (taskId, newProgress) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`,
        { progress: newProgress },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task progress:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`text-xl font-semibold ${activeTab === 'tasks' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
          >
            Aufgaben
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`text-xl font-semibold ${activeTab === 'notes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
          >
            Notizen
          </button>
        </div>
        <div className="flex space-x-2">
          {activeTab === 'tasks' && (
            <button
              onClick={() => document.getElementById('add-task-form').classList.toggle('hidden')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Neue Aufgabe
            </button>
          )}
          {activeTab === 'notes' && (
            <button
              onClick={() => document.getElementById('add-note-form').classList.toggle('hidden')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Neue Notiz
            </button>
          )}
        </div>
      </div>

      {activeTab === 'tasks' && (
        <>
          {/* Add Task Form */}
          <form id="add-task-form" className="hidden mb-6 space-y-4 border-b pb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titel</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows="3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fälligkeitsdatum</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priorität</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zugewiesen an</label>
              <input
                type="text"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Benutzername oder E-Mail"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => document.getElementById('add-task-form').classList.add('hidden')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                onClick={handleAddTask}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Speichern
              </button>
            </div>
          </form>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                    </span>
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                      className="text-sm border rounded-md"
                    >
                      <option value="todo">Offen</option>
                      <option value="in_progress">In Bearbeitung</option>
                      <option value="done">Erledigt</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Fortschritt</span>
                    <span className="text-sm font-medium text-gray-700">{task.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => handleTaskProgressChange(task.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <div>
                    <span>Fällig: {new Date(task.dueDate).toLocaleDateString()}</span>
                    {task.assignedTo && (
                      <span className="ml-4">Zugewiesen an: {task.assignedTo}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'notes' && (
        <>
          {/* Add Note Form */}
          <form id="add-note-form" className="hidden mb-6 space-y-4 border-b pb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notiz</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows="4"
                placeholder="Ihre Notiz hier..."
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => document.getElementById('add-note-form').classList.add('hidden')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                onClick={handleAddNote}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Speichern
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TaskManagement;
