import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import TaskManagement from './TaskManagement';
import ProjectChat from './ProjectChat';
import ProjectMeetings from './ProjectMeetings';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    fetchProject();
  }, [projectId, token]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(response.data);
      setLoading(false);
    } catch (err) {
      setError('Fehler beim Laden des Projekts');
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      fetchProject();
    } catch (err) {
      setError('Fehler beim Hochladen der Datei');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Lädt...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!project) return <div className="text-center p-4">Projekt nicht gefunden</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zu Projekten
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`${
              activeTab === 'tasks'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Aufgaben
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`${
              activeTab === 'files'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Dateien
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`${
              activeTab === 'chat'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`${
              activeTab === 'meetings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Meetings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && <TaskManagement projectId={projectId} />}
      
      {activeTab === 'files' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Projektdateien</h2>
            <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              {uploading ? 'Lädt hoch...' : 'Datei hochladen'}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {project.files && project.files.length > 0 ? (
            <div className="space-y-4">
              {project.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        Hochgeladen am {new Date(file.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => window.open(`http://localhost:5000/uploads/${projectId}/${file.filename}`)}
                  >
                    Herunterladen
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Dateien</h3>
              <p className="mt-1 text-sm text-gray-500">Laden Sie Ihre erste Datei hoch</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && <ProjectChat projectId={projectId} />}
      {activeTab === 'meetings' && <ProjectMeetings projectId={projectId} />}
    </div>
  );
}

export default ProjectDetail;
