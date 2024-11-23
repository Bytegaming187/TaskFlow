import React, { useState } from 'react';

function TaskDetail() {
  const [task, setTask] = useState({
    id: 1,
    title: 'Homepage Design erstellen',
    description: 'Wireframes und Design für die neue Homepage erstellen',
    priority: 'Hoch',
    status: 'In Bearbeitung',
    dueDate: '2023-10-30',
    assignee: 'Anna M.',
    project: 'Website Redesign',
    checklist: [
      { id: 1, text: 'Wireframes erstellen', completed: true },
      { id: 2, text: 'Design-System definieren', completed: true },
      { id: 3, text: 'Mockups erstellen', completed: false },
      { id: 4, text: 'Feedback einarbeiten', completed: false }
    ],
    timeTracking: {
      estimated: 16,
      spent: 10,
      remaining: 6
    },
    comments: [
      {
        id: 1,
        user: 'Max S.',
        text: 'Bitte auch Mobile-Version berücksichtigen',
        timestamp: '2023-10-25T10:30:00',
        likes: 2
      },
      {
        id: 2,
        user: 'Lisa K.',
        text: 'Wireframes sehen gut aus!',
        timestamp: '2023-10-26T14:15:00',
        likes: 1
      }
    ],
    attachments: [
      { id: 1, name: 'wireframes.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 2, name: 'design-system.sketch', size: '8.1 MB', type: 'sketch' }
    ]
  });

  const [newComment, setNewComment] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setTask({
        ...task,
        checklist: [
          ...task.checklist,
          {
            id: task.checklist.length + 1,
            text: newChecklistItem,
            completed: false
          }
        ]
      });
      setNewChecklistItem('');
    }
  };

  const toggleChecklistItem = (itemId) => {
    setTask({
      ...task,
      checklist: task.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const addComment = () => {
    if (newComment.trim()) {
      setTask({
        ...task,
        comments: [
          ...task.comments,
          {
            id: task.comments.length + 1,
            user: 'Aktueller Benutzer',
            text: newComment,
            timestamp: new Date().toISOString(),
            likes: 0
          }
        ]
      });
      setNewComment('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <p className="text-gray-600 mt-1">{task.description}</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Bearbeiten
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Teilen
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left Column - Main Info */}
          <div className="col-span-2 space-y-6">
            {/* Checklist */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-3">Checkliste</h3>
              <div className="space-y-2">
                {task.checklist.map(item => (
                  <div key={item.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="h-4 w-4 text-indigo-600 rounded"
                    />
                    <span className={`ml-2 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Neuer Checklistenpunkt"
                    className="flex-1 border rounded-l px-3 py-1"
                  />
                  <button
                    onClick={addChecklistItem}
                    className="px-4 py-1 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="font-semibold mb-3">Kommentare</h3>
              <div className="space-y-4">
                {task.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{comment.user}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.timestamp).toLocaleString('de-DE')}
                      </span>
                    </div>
                    <p className="mt-1">{comment.text}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {comment.likes} Likes
                    </div>
                  </div>
                ))}
                <div className="flex">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Kommentar hinzufügen"
                    className="flex-1 border rounded-l px-3 py-2"
                  />
                  <button
                    onClick={addComment}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
                  >
                    Senden
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Meta Info */}
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="bg-gray-50 p-4 rounded">
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {task.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Priorität:</span>
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Tracking */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Zeiterfassung</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Geschätzt:</span>
                  <span>{task.timeTracking.estimated}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Aufgewendet:</span>
                  <span>{task.timeTracking.spent}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Verbleibend:</span>
                  <span>{task.timeTracking.remaining}h</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${(task.timeTracking.spent / task.timeTracking.estimated) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Anhänge</h3>
              <div className="space-y-2">
                {task.attachments.map(file => (
                  <div key={file.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span>{file.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{file.size}</span>
                  </div>
                ))}
                <button className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Datei hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
