# Taskflow - Modern Project Management Solution

Taskflow is a comprehensive project management application designed for individuals, teams, and small businesses. It provides an intuitive interface for managing tasks, projects, and team collaboration.

## Features

- User Authentication with email verification
- Project and Task Management
- Team Collaboration
- Real-time Updates
- Role-based Access Control
- Mobile-responsive Design
- Email Notifications
- Dashboard Analytics

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- Socket.io-client

### Backend
- Flask
- MariaDB
- SQLAlchemy
- Flask-SocketIO
- JWT Authentication

### Infrastructure
- Docker
- Docker Compose

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Python 3.8+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

2. Create a .env file in the root directory and configure your environment variables:
```bash
cp .env.example .env
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

## Testing
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
