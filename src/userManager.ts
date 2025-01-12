import { User } from './user'; 

class UserManager {
  public register(email: string, firstName: string, lastName: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email]) {
      alert('Email déjà utilisé.');
      return false;
    }

    users[email] = { email, firstName, lastName, password };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Inscription réussie.');
    return true;
  }

  public login(email: string, password: string): string | null {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email] && users[email].password === password) {
      return email;
    } else {
      alert('Email ou mot de passe incorrect.');
      return null;
    }
  }

  public logout() {
    localStorage.removeItem('currentUser');
  }

  public getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }

  public setCurrentUser(email: string) {
    localStorage.setItem('currentUser', email);
  }
}

const userManager = new UserManager();
export default userManager;
