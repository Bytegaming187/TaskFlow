import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function ProjectChat({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { token } = useAuth();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/messages`,
        { content: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Projekt-Chat</h2>
      
      {/* Messages Container */}
      <div className="h-96 overflow-y-auto mb-4 border rounded-lg bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Lädt Nachrichten...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Noch keine Nachrichten</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isCurrentUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                    message.isCurrentUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.userName}
                  </div>
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Schreiben Sie eine Nachricht..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Senden
        </button>
      </form>
    </div>
  );
}

export default ProjectChat;
