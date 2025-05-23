import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Add or extend functions from here for user login/logout and state management
async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in:", user.email);
        // Render user-specific features
    } else {
        console.log("User logged out");
        // Render guest view
    }
});

// Function to handle registration
async function registerWithEmail(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function for Google login
async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function for Facebook login
async function loginWithFacebook() {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to log out
async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check if user is logged in
function getCurrentUser() {
    return auth.currentUser;
}

// Listen for auth state changes
function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

export { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    loginWithFacebook, 
    logoutUser,
    getCurrentUser,
    onAuthStateChanged
};
