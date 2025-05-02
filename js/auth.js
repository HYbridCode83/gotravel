import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Create user profile in Firestore
async function createUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const userData = {
        displayName: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
    };

    try {
        await setDoc(userRef, userData, { merge: true });
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
}

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user);
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
});

// Sign Up functionality
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user);
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('error-message').textContent = error.message;
    }
});

// Google Sign In
document.getElementById('googleSignIn')?.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        await createUserProfile(result.user);
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

// Add this to auth.js
function handleAuthError(error) {
    const errorMessage = {
        'auth/user-not-found': 'No user found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'Email already registered.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/operation-not-allowed': 'Operation not allowed.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed before finishing.',
    }[error.code] || error.message;

    document.getElementById('error-message').textContent = errorMessage;
}

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Update UI for logged in user
        const loginMenuItems = document.querySelectorAll('#loginMenuItem');
        loginMenuItems.forEach(item => item.style.display = 'none');
        
        const userMenus = document.querySelectorAll('#userMenu');
        userMenus.forEach(menu => menu.style.display = 'block');
    } else {
        // Update UI for logged out user
        const loginMenuItems = document.querySelectorAll('#loginMenuItem');
        loginMenuItems.forEach(item => item.style.display = 'block');
        
        const userMenus = document.querySelectorAll('#userMenu');
        userMenus.forEach(menu => menu.style.display = 'none');
        
        // Redirect to login if on profile page
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
});
