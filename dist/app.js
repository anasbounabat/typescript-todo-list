"use strict";
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentUser = null; // Stocke l'email de l'utilisateur connecté
        this.loadFromLocalStorage();
        this.initEventListeners();
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem('tasks');
        if (data) {
            this.tasks = JSON.parse(data);
        }
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = user;
            this.showTodoSection();
        }
    }
    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        if (this.currentUser) {
            localStorage.setItem('currentUser', this.currentUser);
        }
    }
    initEventListeners() {
        // Ajoutez un écouteur pour le formulaire d'ajout de tâche
        const taskForm = document.getElementById('task-form');
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Empêche le rechargement de la page
            this.addTask();
        });
    }
    register() {
        const email = document.getElementById('register-email').value;
        const lastname = document.getElementById('register-lastname').value;
        const password = document.getElementById('register-password').value;
        if (!email || !lastname || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[email]) {
            alert('Email déjà utilisé.');
            return;
        }
        users[email] = { password, lastname };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Inscription réussie.');
    }
    login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[email] && users[email].password === password) {
            this.currentUser = email;
            this.saveToLocalStorage();
            this.showTodoSection();
        }
        else {
            alert('Email ou mot de passe incorrect.');
        }
    }
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
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
