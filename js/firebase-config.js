// Import Firebase functions 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app);

// Store all destinations
let allDestinations = [];

// Fetch destinations from Firestore
async function fetchDestinations() {
    try {
        const destinationsCollection = collection(db, "destinations");
        const querySnapshot = await getDocs(destinationsCollection);
        
        allDestinations = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Fetched destination:', {
                id: doc.id,
                name: data.name,
                location: data.location,
                category: data.category
            });
            allDestinations.push({
                id: doc.id,
                ...data
            });
        });
        
        console.log("Total destinations loaded:", allDestinations.length);
        return allDestinations;
    } catch (error) {
        console.error("Error fetching destinations:", error);
        return [];
    }
}

// Filter destinations based on search term
function filterDestinations(searchTerm) {
    if (!searchTerm) return [];
    
    searchTerm = searchTerm.toLowerCase();
    console.log('Searching for:', searchTerm);
    console.log('Available destinations:', allDestinations);
    
    return allDestinations.filter(destination => {
        const nameMatch = destination.name?.toLowerCase().includes(searchTerm);
        const descMatch = destination.description?.toLowerCase().includes(searchTerm);
        const locMatch = destination.location?.toLowerCase().includes(searchTerm);
        const catMatch = destination.category?.toLowerCase().includes(searchTerm);
        
        console.log('Checking destination:', destination.name);
        console.log('- Name match:', nameMatch);
        console.log('- Description match:', descMatch);
        console.log('- Location match:', locMatch);
        console.log('- Category match:', catMatch);
        
        return nameMatch || descMatch || locMatch || catMatch;
    });
}

// Display suggestions in the search bar
function displaySuggestions(filteredDestinations, suggestionsList) {
    // Clear previous suggestions
    suggestionsList.innerHTML = '';
    
    if (filteredDestinations.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }
    
    // Add new suggestions
    filteredDestinations.forEach(destination => {
        const li = document.createElement('li');
        li.textContent = destination.name;
        li.addEventListener('click', () => {
            const searchBar = document.getElementById('search-bar');
            if (searchBar) {
                searchBar.value = destination.name;
                suggestionsList.style.display = 'none';
                // Navigate to search results page with the selected destination
                window.location.href = `search-results.html?query=${encodeURIComponent(destination.name)}`;
            }
        });
        suggestionsList.appendChild(li);
    });
    
    // Show suggestions
    suggestionsList.style.display = 'block';
}

// Export necessary functions and variables
export { 
    db,
    auth,
    fetchDestinations,
    filterDestinations,
    displaySuggestions,
    allDestinations
};
