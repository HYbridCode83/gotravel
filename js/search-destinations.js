// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrqJJHSXC4dDrIAO8KY6zg_4UaaOGm5oc",
    authDomain: "gotravel-68bf3.firebaseapp.com",
    projectId: "gotravel-68bf3",
    storageBucket: "gotravel-68bf3.firebasestorage.app",
    messagingSenderId: "290702376216",
    appId: "1:290702376216:web:9592703218777181d6726d",
    measurementId: "G-7ZJF7ZGQGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const searchBar = document.getElementById('search-bar');
const suggestionsList = document.getElementById('suggestions');
const searchButton = document.getElementById('search-button');

// Store all destinations
let allDestinations = [];

// Fetch destinations from Firestore
async function fetchDestinations() {
    try {
        console.log("Fetching destinations from Firestore...");
        const destinationsCollection = collection(db, "destinations");
        const querySnapshot = await getDocs(destinationsCollection);
        
        allDestinations = [];
        querySnapshot.forEach((doc) => {
            // Add each destination document to our array
            allDestinations.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log("Destinations loaded:", allDestinations.length);
    } catch (error) {
        console.error("Error fetching destinations:", error);
    }
}

// Filter destinations based on search term
function filterDestinations(searchTerm) {
    if (!searchTerm) return [];
    
    searchTerm = searchTerm.toLowerCase();
    return allDestinations.filter(destination => {
        // Check if destination name or description contains the search term
        return destination.name?.toLowerCase().includes(searchTerm) || 
               destination.description?.toLowerCase().includes(searchTerm) ||
               destination.location?.toLowerCase().includes(searchTerm);
    });
}

// Display suggestions
function displaySuggestions(filteredDestinations) {
    // Clear previous suggestions
    suggestionsList.innerHTML = '';
    
    if (filteredDestinations.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }
    
    // Add new suggestions
    filteredDestinations.forEach(destination => {
        const li = document.createElement('li');
        li.textContent = destination.name || "Unnamed destination";
        li.addEventListener('click', () => {
            searchBar.value = destination.name || "";
            suggestionsList.style.display = 'none';
            // You can uncomment this to navigate to a detail page
            // window.location.href = `destination.html?id=${destination.id}`;
        });
        suggestionsList.appendChild(li);
    });
    
    // Show suggestions
    suggestionsList.style.display = 'block';
}

// Search function
function performSearch() {
    const searchTerm = searchBar.value.trim();
    if (searchTerm.length >= 2) {
        const filteredDestinations = filterDestinations(searchTerm);
        displaySuggestions(filteredDestinations);
    } else {
        suggestionsList.style.display = 'none';
    }
}

// Event listeners
searchBar.addEventListener('input', performSearch);

searchBar.addEventListener('focus', () => {
    if (searchBar.value.trim().length >= 2) {
        performSearch();
    }
});

document.addEventListener('click', (e) => {
    if (e.target !== searchBar && e.target !== suggestionsList) {
        suggestionsList.style.display = 'none';
    }
});

searchButton.addEventListener('click', () => {
    performSearch();
});

// Initialize - fetch destinations when page loads
document.addEventListener('DOMContentLoaded', fetchDestinations);

// For debugging
console.log("Search destinations script loaded");
