import React from 'react';
import { Chart } from 'react-google-charts';

function ProjectTimeline() {
  const data = [
    [
      { type: 'string', id: 'Position' },
      { type: 'string', id: 'Name' },
      { type: 'date', id: 'Start' },
      { type: 'date', id: 'End' },
    ],
    [
      'Projektmanager',
      'Projektplanung',
      new Date(2023, 9, 1),
      new Date(2023, 9, 15),
    ],
    [
      'Designer',
      'UI/UX Design',
      new Date(2023, 9, 10),
      new Date(2023, 10, 1),
    ],
    [
      'Frontend',
      'Frontend-Entwicklung',
      new Date(2023, 9, 20),
      new Date(2023, 10, 20),
    ],
    [
      'Backend',
      'Backend-Entwicklung',
      new Date(2023, 9, 20),
      new Date(2023, 10, 25),
    ],
    [
      'QA',
      'Testing',
      new Date(2023, 10, 15),
      new Date(2023, 11, 1),
    ],
  ];

  const options = {
    timeline: {
      showRowLabels: true,
      groupByRowLabel: false,
    },
    avoidOverlappingGridLines: false,
  };

  const projectMetrics = {
    totalTasks: 45,
    completedTasks: 28,
    inProgressTasks: 12,
    upcomingTasks: 5,
    projectProgress: 62,
    teamMembers: 8,
    nextMilestone: '2024-02-15',
    projectHealth: 'good', // 'good', 'warning', or 'critical'
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Projekt Timeline</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Exportieren
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Filter
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-medium text-gray-500">Gesamtfortschritt</h3>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${projectMetrics.projectProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{projectMetrics.projectProgress}%</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-medium text-gray-500">Aufgaben Status</h3>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">{projectMetrics.completedTasks} Erledigt</span>
                  <span className="text-yellow-600">{projectMetrics.inProgressTasks} In Arbeit</span>
                  <span className="text-gray-600">{projectMetrics.upcomingTasks} Offen</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-medium text-gray-500">Nächster Meilenstein</h3>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">
                  {new Date(projectMetrics.nextMilestone).toLocaleDateString()}
                </p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    projectMetrics.projectHealth === 'good' ? 'bg-green-100 text-green-800' :
                    projectMetrics.projectHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {projectMetrics.projectHealth === 'good' ? 'Im Zeitplan' :
                     projectMetrics.projectHealth === 'warning' ? 'Leichte Verzögerung' :
                     'Kritische Verzögerung'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-medium text-gray-500">Team</h3>
              <div className="mt-2">
                <p className="text-2xl font-semibold text-gray-900">{projectMetrics.teamMembers}</p>
                <p className="text-sm text-gray-500">Aktive Mitglieder</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Chart
            chartType="Timeline"
            data={data}
            options={options}
            width="100%"
            height="400px"
          />
        </div>

        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Projektfortschritt Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Projektplanung</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">100%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">UI/UX Design</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Frontend-Entwicklung</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">60%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Backend-Entwicklung</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Testing</span>
              <div className="flex items-center flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectTimeline;
