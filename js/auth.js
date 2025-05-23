// Firebase imports
import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

let currentUser = null;

// Auth state listener
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  // Handle UI updates here
  if (user) {
    // Update last login time
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    // UI update
    document.querySelectorAll('#loginMenuItem').forEach(item => item.style.display = 'none');
    document.querySelectorAll('#userMenu').forEach(menu => {
      menu.style.display = 'flex';
      const profileBtn = menu.querySelector('#userProfile');
      if (profileBtn) profileBtn.textContent = user.displayName || 'My Profile';
    });
  } else {
    document.querySelectorAll('#loginMenuItem').forEach(item => item.style.display = 'block');
    document.querySelectorAll('#userMenu').forEach(menu => menu.style.display = 'none');
    // Redirect if needed
    if (['profile.html'].some(page => window.location.pathname.includes(page))) {
      window.location.href = 'login.html';
    }
  }
});

// Unified sign-in
async function loginWithEmail(email, password) {
  try {
    validateUserData(email, password);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    handleAuthError(error);
    return { success: false, error: error.message };
  }
}

// Unified registration
async function registerWithEmail(email, password) {
  try {
    validateUserData(email, password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user);
    return { success: true, user: userCredential.user };
  } catch (error) {
    handleAuthError(error);
    return { success: false, error: error.message };
  }
}

// Google login
async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    handleAuthError(error);
    return { success: false, error: error.message };
  }
}

// Facebook login
async function loginWithFacebook() {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await createUserProfile(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    handleAuthError(error);
    return { success: false, error: error.message };
  }
}

// Log out
async function logoutUser() {
  try {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { lastLogout: serverTimestamp() }, { merge: true });
    }
    await signOut(auth);
    window.location.href = 'login.html';
    return { success: true };
  } catch (error) {
    handleAuthError(error);
    return { success: false, error: error.message };
  }
}

// Utility: Create/update user profile
async function createUserProfile(user) {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const userData = {
    displayName: user.displayName || user.email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL || '',
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    role: 'user',
    settings: { notifications: true, theme: 'light' }
  };
  await setDoc(userRef, userData, { merge: true });
}

// Utility: Validate user data
function validateUserData(email, password, confirmPassword = null) {
  if (!email || !password) throw new Error('Email and password are required');
  if (!email.includes('@')) throw new Error('Invalid email format');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  if (confirmPassword !== null && password !== confirmPassword) throw new Error('Passwords do not match');
}

// Utility: Error handler
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
  if (errorElement) errorElement.textContent = errorMessage;
  else console.error(errorMessage);
}

// Exports (if used as module elsewhere)
export {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  logoutUser,
  createUserProfile
};

// Attach event listeners for forms/buttons (login, signup, logout)
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  await loginWithEmail(email, password);
});

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  validateUserData(email, password, confirmPassword);
  await registerWithEmail(email, password);
});

document.getElementById('googleSignIn')?.addEventListener('click', loginWithGoogle);
document.getElementById('facebookSignIn')?.addEventListener('click', loginWithFacebook);
document.getElementById('signOutBtn')?.addEventListener('click', logoutUser);
