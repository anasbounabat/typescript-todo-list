class UserManager {
    // Méthode pour enregistrer un nouvel utilisateur
    register(email, firstName, lastName, password) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        // Vérifie si l'email est déjà utilisé
        if (users[email]) {
            alert('Email déjà utilisé.');
            return false;
        }
        // Crée un nouvel utilisateur et le sauvegarde dans localStorage
        users[email] = { email, firstName, lastName, password };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Inscription réussie.');
        return true;
    }
    // Méthode pour se connecter
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        // Vérifie si l'email et le mot de passe sont valides
        if (users[email] && users[email].password === password) {
            return email;
        }
        else {
            alert('Email ou mot de passe incorrect.');
            return null;
        }
    }
    // Méthode pour déconnecter l'utilisateur
    logout() {
        localStorage.removeItem('currentUser');
    }
    // Méthode pour récupérer l'utilisateur actuel
    getCurrentUser() {
        return localStorage.getItem('currentUser');
    }
    // Méthode pour définir l'utilisateur actuel
    setCurrentUser(email) {
        localStorage.setItem('currentUser', email);
    }
}
const userManager = new UserManager();
export default userManager;
