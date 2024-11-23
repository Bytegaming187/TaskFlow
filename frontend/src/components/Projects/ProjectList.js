import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Projekte');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  if (loading) return <div className="text-center p-4">Lädt...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Meine Projekte</h2>
        <Link
          to="/projects/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Neues Projekt
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{project.files_count} Dateien</span>
                <span>Aktualisiert: {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Noch keine Projekte</h3>
          <p className="text-gray-500">Erstellen Sie Ihr erstes Projekt, um loszulegen!</p>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
