class UserManager {
    register(email, firstName, lastName, password) {
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
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[email] && users[email].password === password) {
            return email;
        }
        else {
            alert('Email ou mot de passe incorrect.');
            return null;
        }
    }
    logout() {
        localStorage.removeItem('currentUser');
    }
    getCurrentUser() {
        return localStorage.getItem('currentUser');
    }
    setCurrentUser(email) {
        localStorage.setItem('currentUser', email);
    }
}
const userManager = new UserManager();
export default userManager;
