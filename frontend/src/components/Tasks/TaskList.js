import React, { useState } from 'react';

function TaskList() {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Homepage Design erstellen',
      description: 'Wireframes und Design für die neue Homepage erstellen',
      priority: 'Hoch',
      status: 'In Bearbeitung',
      dueDate: '2023-10-30',
      assignee: 'Anna M.',
      project: 'Website Redesign'
    },
    {
      id: 2,
      title: 'API Dokumentation',
      description: 'REST API Endpoints dokumentieren',
      priority: 'Mittel',
      status: 'Offen',
      dueDate: '2023-11-15',
      assignee: 'Max S.',
      project: 'Mobile App'
    },
    {
      id: 3,
      title: 'Social Media Posts',
      description: 'Content für Instagram und LinkedIn erstellen',
      priority: 'Niedrig',
      status: 'Abgeschlossen',
      dueDate: '2023-10-25',
      assignee: 'Lisa K.',
      project: 'Marketing Kampagne'
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'hoch':
        return 'bg-red-100 text-red-800';
      case 'mittel':
        return 'bg-yellow-100 text-yellow-800';
      case 'niedrig':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'abgeschlossen':
        return 'bg-green-100 text-green-800';
      case 'in bearbeitung':
        return 'bg-blue-100 text-blue-800';
      case 'offen':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Aufgaben</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            Neue Aufgabe
          </button>
        </div>

        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={task.status.toLowerCase() === 'abgeschlossen'}
                          readOnly
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="truncate">Projekt: {task.project}</span>
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <span className="truncate">Zugewiesen an: {task.assignee}</span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Fällig am: {new Date(task.dueDate).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
