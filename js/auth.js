// Get DOM elements
const userStatus = document.getElementById('user-status');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

// Handle login
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Clear form
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        alert('Error logging in: ' + error.message);
    }
});

// Handle signup
signupBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        // Clear form
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        alert('Error signing up: ' + error.message);
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Listen for auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        userStatus.textContent = `Logged in as: ${user.email}`;
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        emailInput.style.display = 'none';
        passwordInput.style.display = 'none';
    } else {
        // User is signed out
        userStatus.textContent = 'Not logged in';
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        emailInput.style.display = 'block';
        passwordInput.style.display = 'block';
    }
});
