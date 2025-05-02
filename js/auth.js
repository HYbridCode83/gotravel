import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
});

// Google Sign In
document.getElementById('googleSignIn')?.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
});

// Password reset
document.getElementById('forgotPassword')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!email) {
        document.getElementById('error-message').textContent = 'Please enter your email first';
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent!');
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
});

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }
});


document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById('error-message').textContent = 'Passwords do not match';
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
});
