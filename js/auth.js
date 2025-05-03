import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Add this right after your imports
let currentUser = null;

// Update your onAuthStateChanged function
onAuthStateChanged(auth, async (user) => {
    currentUser = user; // Store the current user

    if (user) {
        // User is logged in
        try {
            // Update last login time
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });

            // Update UI elements
            document.querySelectorAll('#loginMenuItem').forEach(item => {
                item.style.display = 'none';
            });
            
            document.querySelectorAll('#userMenu').forEach(menu => {
                menu.style.display = 'flex';
                const profileBtn = menu.querySelector('#userProfile');
                if (profileBtn) {
                    profileBtn.textContent = user.displayName || 'My Profile';
                }
            });

        } catch (error) {
            console.error('Error updating user data:', error);
        }
    } else {
        // User is logged out
        document.querySelectorAll('#loginMenuItem').forEach(item => {
            item.style.display = 'block';
        });
        
        document.querySelectorAll('#userMenu').forEach(menu => {
            menu.style.display = 'none';
        });

        // Redirect if on protected pages
        const protectedPages = ['profile.html'];
        if (protectedPages.some(page => window.location.pathname.includes(page))) {
            window.location.href = 'login.html';
        }
    }
});

// Add sign out functionality
document.getElementById('signOutBtn')?.addEventListener('click', async () => {
    try {
        // Update last logout time before signing out
        if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, {
                lastLogout: serverTimestamp()
            }, { merge: true });
        }
        
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing out:', error);
        handleAuthError(error);
    }
});

// Update your handleAuthError function to include sign out errors
function handleAuthError(error) {
    const errorMessage = {
        'auth/user-not-found': 'No user found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'Email already registered.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/operation-not-allowed': 'Operation not allowed.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed before finishing.',
        'auth/requires-recent-login': 'Please sign in again to complete this operation.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
    }[error.code] || error.message;

    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = errorMessage;
    } else {
        console.error(errorMessage);
    }
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Create user profile in Firestore
async function createUserProfile(user) {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userData = {
        displayName: user.displayName || user.email.split('@')[0], // Use email username if no display name
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'user', // Add basic role management
        settings: {
            notifications: true,
            theme: 'light'
        }
    };

    try {
        await setDoc(userRef, userData, { merge: true });
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error; // Propagate error for handling
    }
}

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    try {
        validateUserData(email, password);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user);
        window.location.href = 'index.html';
    } catch (error) {
        handleAuthError(error);
    }
});

// Sign Up functionality
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    try {
        validateUserData(email, password, confirmPassword);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user);
        window.location.href = 'index.html';
    } catch (error) {
        handleAuthError(error);
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

// Add user data validation
function validateUserData(email, password, confirmPassword = null) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    if (!email.includes('@')) {
        throw new Error('Invalid email format');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    if (confirmPassword !== null && password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
}

function setLoading(isLoading) {
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        button.disabled = isLoading;
        button.textContent = isLoading ? 'Loading...' : button.dataset.originalText || 'Submit';
    });
}
