import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function ProjectMeetings({ projectId }) {
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
  });
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, [projectId]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/meetings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setLoading(false);
    }
  };

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/meetings`,
        newMeeting,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMeetings([...meetings, response.data]);
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        location: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding meeting:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Meetings</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Neues Meeting
        </button>
      </div>

      {/* Add Meeting Form */}
      {showForm && (
        <form onSubmit={handleAddMeeting} className="mb-6 space-y-4 border-b pb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titel</label>
            <input
              type="text"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
            <textarea
              value={newMeeting.description}
              onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Datum</label>
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Uhrzeit</label>
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dauer (Minuten)</label>
              <input
                type="number"
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="15"
                step="15"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ort / Link</label>
              <input
                type="text"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Raum oder Meeting-Link"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Meeting erstellen
            </button>
          </div>
        </form>
      )}

      {/* Meetings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Lädt...</div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Keine Meetings geplant</div>
        ) : (
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{meeting.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{meeting.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(`${meeting.date}T${meeting.time}`).toLocaleString()}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {meeting.duration} Minuten
                </div>
                <div className="flex items-center text-gray-500">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {meeting.location}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectMeetings;
