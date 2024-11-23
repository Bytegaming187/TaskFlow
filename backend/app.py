from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# CORS-Konfiguration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Konfiguration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'O.On90mAvltUMAs+^WlRLxXE')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:example@db/taskflow')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY', 'O.On90mAvltUMAs+^WlRLxXE')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Konfiguration für Datei-Uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialisierung der Erweiterungen
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Benutzer-Modell
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    projects = db.relationship('Project', backref='owner', lazy=True)
    project_memberships = db.relationship('ProjectMember', backref='user', lazy=True)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    files = db.relationship('ProjectFile', backref='project', lazy=True)
    tasks = db.relationship('Task', backref='project', lazy=True)
    notes = db.relationship('Note', backref='project', lazy=True)
    members = db.relationship('ProjectMember', backref='project', lazy=True)

class ProjectMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role = db.Column(db.String(50), default='member')  # 'owner', 'member'
    joined_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='todo')  # 'todo', 'in_progress', 'done'
    priority = db.Column(db.String(50), default='medium')  # 'low', 'medium', 'high'
    progress = db.Column(db.Integer, default=0)  # 0-100
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'))

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class ProjectFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

# Routen
@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Taskflow API is running"})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Überprüfen, ob Benutzer bereits existiert
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Benutzername bereits vergeben"}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "E-Mail bereits registriert"}), 400
    
    # Passwort hashen und Benutzer erstellen
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Token für den neuen Benutzer erstellen
    access_token = create_access_token(identity=new_user.username)
    return jsonify({
        "message": "Benutzer erfolgreich registriert",
        "token": access_token,
        "username": new_user.username
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.username)
        return jsonify({
            "message": "Login erfolgreich",
            "token": access_token,
            "username": user.username
        }), 200
    
    return jsonify({"message": "Ungültige Anmeldedaten"}), 401

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({"message": "Benutzer nicht gefunden"}), 404
    
    return jsonify({
        "username": user.username,
        "email": user.email
    }), 200

@app.route('/api/projects', methods=['GET'])
@jwt_required()
def get_projects():
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    projects = Project.query.filter_by(owner_id=current_user.id).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'created_at': p.created_at.isoformat(),
        'updated_at': p.updated_at.isoformat(),
        'files_count': len(p.files)
    } for p in projects]), 200

@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    data = request.get_json()

    if not data.get('name'):
        return jsonify({"message": "Projektname ist erforderlich"}), 400

    project = Project(
        name=data['name'],
        description=data.get('description', ''),
        owner_id=current_user.id
    )
    
    db.session.add(project)
    db.session.commit()

    return jsonify({
        'id': project.id,
        'name': project.name,
        'description': project.description,
        'created_at': project.created_at.isoformat(),
        'updated_at': project.updated_at.isoformat()
    }), 201

@app.route('/api/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.filter_by(id=project_id, owner_id=current_user.id).first()
    
    if not project:
        return jsonify({"message": "Projekt nicht gefunden"}), 404

    return jsonify({
        'id': project.id,
        'name': project.name,
        'description': project.description,
        'created_at': project.created_at.isoformat(),
        'updated_at': project.updated_at.isoformat(),
        'files': [{
            'id': f.id,
            'filename': f.filename,
            'uploaded_at': f.uploaded_at.isoformat()
        } for f in project.files]
    }), 200

@app.route('/api/projects/<int:project_id>/files', methods=['POST'])
@jwt_required()
def upload_file(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.filter_by(id=project_id, owner_id=current_user.id).first()
    
    if not project:
        return jsonify({"message": "Projekt nicht gefunden"}), 404

    if 'file' not in request.files:
        return jsonify({"message": "Keine Datei hochgeladen"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "Keine Datei ausgewählt"}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', str(project_id), filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        file.save(file_path)

        project_file = ProjectFile(
            filename=filename,
            file_path=file_path,
            project_id=project_id
        )
        db.session.add(project_file)
        db.session.commit()

        return jsonify({
            'id': project_file.id,
            'filename': project_file.filename,
            'uploaded_at': project_file.uploaded_at.isoformat()
        }), 201

@app.route('/uploads/<path:filename>')
@jwt_required()
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Task-bezogene Routen
@app.route('/api/projects/<int:project_id>/tasks', methods=['GET'])
@jwt_required()
def get_tasks(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.get_or_404(project_id)
    
    # Überprüfen, ob der Benutzer Zugriff auf das Projekt hat
    if not (project.owner_id == current_user.id or 
            ProjectMember.query.filter_by(project_id=project_id, user_id=current_user.id).first()):
        return jsonify({"message": "Keine Berechtigung"}), 403
    
    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'priority': task.priority,
        'progress': task.progress,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat(),
        'assigned_to': task.assigned_to
    } for task in tasks]), 200

@app.route('/api/projects/<int:project_id>/tasks', methods=['POST'])
@jwt_required()
def create_task(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.get_or_404(project_id)
    
    if not (project.owner_id == current_user.id or 
            ProjectMember.query.filter_by(project_id=project_id, user_id=current_user.id).first()):
        return jsonify({"message": "Keine Berechtigung"}), 403
    
    data = request.get_json()
    new_task = Task(
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'todo'),
        priority=data.get('priority', 'medium'),
        progress=data.get('progress', 0),
        due_date=data.get('due_date'),
        project_id=project_id,
        assigned_to=data.get('assigned_to')
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({
        'id': new_task.id,
        'title': new_task.title,
        'description': new_task.description,
        'status': new_task.status,
        'priority': new_task.priority,
        'progress': new_task.progress,
        'due_date': new_task.due_date.isoformat() if new_task.due_date else None,
        'created_at': new_task.created_at.isoformat(),
        'updated_at': new_task.updated_at.isoformat(),
        'assigned_to': new_task.assigned_to
    }), 201

# Notiz-bezogene Routen
@app.route('/api/projects/<int:project_id>/notes', methods=['GET'])
@jwt_required()
def get_notes(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.get_or_404(project_id)
    
    if not (project.owner_id == current_user.id or 
            ProjectMember.query.filter_by(project_id=project_id, user_id=current_user.id).first()):
        return jsonify({"message": "Keine Berechtigung"}), 403
    
    notes = Note.query.filter_by(project_id=project_id).order_by(Note.created_at.desc()).all()
    return jsonify([{
        'id': note.id,
        'content': note.content,
        'created_at': note.created_at.isoformat(),
        'updated_at': note.updated_at.isoformat(),
        'user_id': note.user_id
    } for note in notes]), 200

@app.route('/api/projects/<int:project_id>/notes', methods=['POST'])
@jwt_required()
def create_note(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.get_or_404(project_id)
    
    if not (project.owner_id == current_user.id or 
            ProjectMember.query.filter_by(project_id=project_id, user_id=current_user.id).first()):
        return jsonify({"message": "Keine Berechtigung"}), 403
    
    data = request.get_json()
    new_note = Note(
        content=data['content'],
        project_id=project_id,
        user_id=current_user.id
    )
    
    db.session.add(new_note)
    db.session.commit()
    
    return jsonify({
        'id': new_note.id,
        'content': new_note.content,
        'created_at': new_note.created_at.isoformat(),
        'updated_at': new_note.updated_at.isoformat(),
        'user_id': new_note.user_id
    }), 201

# Projekt-Mitglieder Routen
@app.route('/api/projects/<int:project_id>/members', methods=['GET'])
@jwt_required()
def get_project_members(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.get_or_404(project_id)
    
    if not (project.owner_id == current_user.id or 
            ProjectMember.query.filter_by(project_id=project_id, user_id=current_user.id).first()):
        return jsonify({"message": "Keine Berechtigung"}), 403
    
    members = ProjectMember.query.filter_by(project_id=project_id).all()
    return jsonify([{
        'id': member.id,
        'user_id': member.user_id,
        'username': member.user.username,
        'role': member.role,
        'joined_at': member.joined_at.isoformat()
    } for member in members]), 200

@app.route('/api/projects/<int:project_id>/invite', methods=['POST'])
@jwt_required()
def invite_member(project_id):
    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    project = Project.query.get_or_404(project_id)
    
    # Nur der Projektbesitzer kann Mitglieder einladen
    if project.owner_id != current_user.id:
        return jsonify({"message": "Keine Berechtigung"}), 403
    
    data = request.get_json()
    invited_user = User.query.filter_by(username=data['username']).first()
    
    if not invited_user:
        return jsonify({"message": "Benutzer nicht gefunden"}), 404
        
    if ProjectMember.query.filter_by(project_id=project_id, user_id=invited_user.id).first():
        return jsonify({"message": "Benutzer ist bereits Projektmitglied"}), 400
    
    new_member = ProjectMember(
        project_id=project_id,
        user_id=invited_user.id,
        role='member'
    )
    
    db.session.add(new_member)
    db.session.commit()
    
    return jsonify({
        'message': 'Benutzer erfolgreich eingeladen',
        'member': {
            'id': new_member.id,
            'user_id': new_member.user_id,
            'username': invited_user.username,
            'role': new_member.role,
            'joined_at': new_member.joined_at.isoformat()
        }
    }), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Erstellt die Datenbanktabellen
    app.run(host='0.0.0.0', port=5000, debug=True)
