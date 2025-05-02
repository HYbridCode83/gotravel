// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// Firebase configuration 
import { db } from './firebase-config.js';

// Initialize auth
const auth = getAuth();

// Fallback destinations array (in case Firebase fetch fails)
const staticDestinations = [
    "Kuching",
    "Sibu",
    "Miri",
    "Bintulu",
    "Sri Aman",
    "Serian",
    "Mukah",
    "Kapit",
    "Betong",
    "Limbang",
    "Kota Samarahan",
    "Sarikei"
];

// Store destinations fetched from Firebase
let destinations = [...staticDestinations];

// Fetch destinations from Firebase
async function fetchDestinations() {
    try {
        const destinationsCollection = collection(db, "destinations");
        const querySnapshot = await getDocs(destinationsCollection);
        
        // If we get results, update the destinations array
        if (!querySnapshot.empty) {
            destinations = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.name) {
                    destinations.push(data.name);
                }
            });
        }
        console.log("Destinations loaded:", destinations.length);
    } catch (error) {
        console.error("Error getting destinations:", error);
        // Keep using the static destinations if Firebase fetch fails
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const suggestions = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');
    
    // Initialize by fetching destinations from Firebase
    fetchDestinations();
    
    if (searchBar && suggestions) {
        searchBar.addEventListener('input', () => {
            const query = searchBar.value.toLowerCase();
            suggestions.innerHTML = '';
            
            if (query) {
                const filteredDestinations = destinations.filter(destination =>
                    destination.toLowerCase().includes(query)
                );
                
                if (filteredDestinations.length > 0) {
                    suggestions.style.display = 'block';
                    
                    filteredDestinations.forEach(destination => {
                        const li = document.createElement('li');
                        li.textContent = destination;
                        li.addEventListener('click', () => {
                            searchBar.value = destination;
                            suggestions.style.display = 'none';
                            // Redirect to search results with this destination
                            window.location.href = `search-results.html?query=${encodeURIComponent(destination)}`;
                        });
                        suggestions.appendChild(li);
                    });
                } else {
                    suggestions.style.display = 'none';
                }
            } else {
                suggestions.style.display = 'none';
            }
        });
        
        // Handle search button click
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchBar.value.trim();
                if (query) {
                    window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
                }
            });
        }
        
        // Handle Enter key in search bar
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchBar.value.trim();
                if (query) {
                    window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
                }
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== searchBar) {
                suggestions.style.display = 'none';
            }
        });
    }
});


// Save a destination for the logged-in user
async function saveDestination(destination) {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to save destinations.");

    try {
        const docRef = await addDoc(collection(db, "users", user.uid, "savedDestinations"), destination);
        console.log("Destination saved with ID:", docRef.id);
    } catch (error) {
        console.error("Error saving destination:", error);
    }
}

async function fetchSavedDestinations() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(collection(db, "users", user.uid, "savedDestinations"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching saved destinations:", error);
        return [];
    }
}

// Add auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        // You can update UI elements here to show logged-in state
    } else {
        // User is signed out
        console.log('User is signed out');
        // You can update UI elements here to show logged-out state
    }
    
    
    // Sign up with email and password
async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

// Sign in with email and password
async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}
});
