import userManager from './userManager'; // Importation du gestionnaire d'utilisateurs
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentUser = null; // Stocke l'email de l'utilisateur connecté
        this.currentUserData = null; // Contient les infos de l'utilisateur connecté
        this.loadFromLocalStorage();
        this.initEventListeners();
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem('tasks');
        if (data) {
            this.tasks = JSON.parse(data);
        }
        const email = userManager.getCurrentUser();
        if (email) {
            this.currentUser = email;
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            this.currentUserData = {
                firstName: users[email].firstName,
                lastName: users[email].lastName
            };
            this.showTodoSection();
        }
        else {
            this.showAuthSection();
        }
    }
    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        if (this.currentUser) {
            localStorage.setItem('currentUser', this.currentUser);
        }
    }
    initEventListeners() {
        // Écouteurs pour les actions sur le formulaire
        const taskForm = document.getElementById('task-form');
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Empêche le rechargement de la page
            this.addTask();
        });
        // Écouteurs pour les actions de connexion et d'inscription
        document.getElementById('register-btn').addEventListener('click', () => this.register());
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }
    register() {
        const email = document.getElementById('register-email').value;
        const firstName = document.getElementById('register-firstname').value;
        const lastName = document.getElementById('register-lastname').value;
        const password = document.getElementById('register-password').value;
        if (!email || !firstName || !lastName || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        if (userManager.register(email, firstName, lastName, password)) {
            userManager.setCurrentUser(email);
            this.currentUser = email;
            this.currentUserData = { firstName, lastName };
            this.showTodoSection();
        }
    }
    login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const user = userManager.login(email, password);
        if (user) {
            this.currentUser = user;
            this.currentUserData = {
                firstName: JSON.parse(localStorage.getItem('users') || '{}')[user].firstName,
                lastName: JSON.parse(localStorage.getItem('users') || '{}')[user].lastName
            };
            userManager.setCurrentUser(user);
            this.showTodoSection();
        }
    }
    logout() {
        userManager.logout();
        this.currentUser = null;
        this.currentUserData = null;
        this.showAuthSection();
    }
    addTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const deadline = document.getElementById('task-deadline').value;
        if (!title || !deadline) {
            alert('Veuillez remplir le titre et la date limite.');
            return;
        }
        const task = {
            id: Date.now().toString(),
            title,
            description,
            status: 'pending',
            deadline,
            owner: this.currentUser, // Utilise l'email de l'utilisateur connecté
        };
        this.tasks.push(task);
        this.saveToLocalStorage();
        this.renderTasks(); // Rafraîchit la liste des tâches après ajout
    }
    renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; // Vide la liste avant de la rendre
        this.tasks
            .filter((task) => task.owner === this.currentUser) // Affiche uniquement les tâches de l'utilisateur connecté
            .forEach((task) => {
            const taskEl = document.createElement('div');
            taskEl.className = `task ${task.status === 'completed' ? 'completed' : ''}`;
            taskEl.innerHTML = `
          <div>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Date limite : ${task.deadline}</p>
          </div>
          <div>
            ${task.status === 'pending'
                ? `<button onclick="app.completeTask('${task.id}')">Valider</button>`
                : ''}
            <button onclick="app.deleteTask('${task.id}')">Supprimer</button>
          </div>
        `;
            taskList.appendChild(taskEl);
        });
    }
    completeTask(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            task.status = 'completed';
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }
    deleteTask(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task && task.status !== 'completed') {
            this.tasks = this.tasks.filter((task) => task.id !== id);
            this.saveToLocalStorage();
            this.renderTasks();
        }
        else {
            alert('Impossible de supprimer une tâche validée.');
        }
    }
    showTodoSection() {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('todo-section').style.display = 'block';
        this.renderTasks();
    }
    showAuthSection() {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('todo-section').style.display = 'none';
    }
}
const app = new TodoApp();
