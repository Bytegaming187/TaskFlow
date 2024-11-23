import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <svg
            className="w-20 h-20 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-5xl font-bold text-white ml-4">Taskflow</h1>
        </div>
        <p className="text-xl text-white mb-8">
          Moderne Projektmanagement-Plattform für effiziente Teamarbeit
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Über Uns</h3>
          <p className="text-gray-600 mb-4">
            Erfahren Sie mehr über unser Team und unsere Vision für moderne Projektmanagement-Lösungen.
          </p>
          <Link
            to="/about"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Mehr über uns →
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Unsere Mission</h3>
          <p className="text-gray-600 mb-4">
            Wir machen Projektmanagement einfach, effizient und zugänglich für Teams jeder Größe.
          </p>
          <Link
            to="/mission"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Unsere Geschichte →
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Kontakt</h3>
          <p className="text-gray-600 mb-4">
            Haben Sie Fragen? Unser Team steht Ihnen gerne zur Verfügung.
          </p>
          <Link
            to="/contact"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Kontaktieren Sie uns →
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-white text-sm">
          2024 Taskflow. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  );
}

export default Home;
