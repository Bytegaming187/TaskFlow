import React from 'react';
import { Chart } from 'react-google-charts';

function GanttChart() {
  const data = [
    [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ],
    [
      'Design',
      'Website Design',
      'Design Team',
      new Date(2023, 9, 1),
      new Date(2023, 9, 15),
      null,
      75,
      null,
    ],
    [
      'Frontend',
      'Frontend Entwicklung',
      'Dev Team',
      new Date(2023, 9, 10),
      new Date(2023, 10, 10),
      null,
      30,
      'Design',
    ],
    [
      'Backend',
      'Backend Entwicklung',
      'Dev Team',
      new Date(2023, 9, 15),
      new Date(2023, 10, 15),
      null,
      20,
      'Design',
    ],
    [
      'Testing',
      'Qualitätssicherung',
      'QA Team',
      new Date(2023, 10, 10),
      new Date(2023, 10, 25),
      null,
      0,
      'Frontend,Backend',
    ],
  ];

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      criticalPathEnabled: true,
      arrow: {
        angle: 100,
        width: 2,
        color: '#3730a3',
        radius: 0,
      },
    },
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Projektplanung</h2>
        <div className="mb-4">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Neue Aufgabe
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Filter
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Exportieren
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Chart
            chartType="Gantt"
            width="100%"
            height="400px"
            data={data}
            options={options}
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Legende</h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div>
              <span>Abgeschlossen</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <span>Geplant</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span>Kritischer Pfad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GanttChart;
