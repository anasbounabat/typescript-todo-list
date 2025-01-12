import { Task } from './task';
import userManager from './userManager'; 

class TodoApp {
  private tasks: Task[] = [];
  private currentUser: string | null = null; 
  private currentUserData: { firstName: string; lastName: string } | null = null; 

  constructor() {
    this.loadFromLocalStorage();
    this.initEventListeners();
  }

  private loadFromLocalStorage() {
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
    } else {
      this.showAuthSection();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    if (this.currentUser) {
      localStorage.setItem('currentUser', this.currentUser);
    }
  }

  private initEventListeners() {
    // Écouteurs pour les actions sur le formulaire
    const taskForm = document.getElementById('task-form') as HTMLFormElement;
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Empêche le rechargement de la page
      this.addTask();
    });

    document.getElementById('register-btn')!.addEventListener('click', () => this.register());
    document.getElementById('login-btn')!.addEventListener('click', () => this.login());
    document.getElementById('logout-btn')!.addEventListener('click', () => this.logout());
  }

  private register() {
    const email = (document.getElementById('register-email') as HTMLInputElement).value;
    const firstName = (document.getElementById('register-firstname') as HTMLInputElement).value;
    const lastName = (document.getElementById('register-lastname') as HTMLInputElement).value;
    const password = (document.getElementById('register-password') as HTMLInputElement).value;

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

  private login() {
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

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

  private logout() {
    userManager.logout();
    this.currentUser = null;
    this.currentUserData = null;
    this.showAuthSection();
  }

  private addTask() {
    const title = (document.getElementById('task-title') as HTMLInputElement).value;
    const description = (document.getElementById('task-desc') as HTMLTextAreaElement).value;
    const deadline = (document.getElementById('task-deadline') as HTMLInputElement).value;

    if (!title || !deadline) {
      alert('Veuillez remplir le titre et la date limite.');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'pending',
      deadline,
      owner: this.currentUser!, 
    };

    this.tasks.push(task);
    this.saveToLocalStorage();
    this.renderTasks(); 
  }

  private renderTasks() {
    const taskList = document.getElementById('task-list')!;
    taskList.innerHTML = ''; 

    this.tasks
      .filter((task) => task.owner === this.currentUser) 
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
            ${
              task.status === 'pending'
                ? `<button onclick="app.completeTask('${task.id}')">Valider</button>`
                : ''
            }
            <button onclick="app.deleteTask('${task.id}')">Supprimer</button>
          </div>
        `;
        taskList.appendChild(taskEl);
      });
  }

  public completeTask(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.status = 'completed';
      this.saveToLocalStorage();
      this.renderTasks();
    }
  }

  public deleteTask(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (task && task.status !== 'completed') {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      this.saveToLocalStorage();
      this.renderTasks();
    } else {
      alert('Impossible de supprimer une tâche validée.');
    }
  }

  private showTodoSection() {
    document.getElementById('auth-section')!.style.display = 'none';
    document.getElementById('todo-section')!.style.display = 'block';
    this.renderTasks();
  }

  private showAuthSection() {
    document.getElementById('auth-section')!.style.display = 'block';
    document.getElementById('todo-section')!.style.display = 'none';
  }
}

const app = new TodoApp();
