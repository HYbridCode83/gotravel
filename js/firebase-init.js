// Import Firebase functions 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrqJJHSXC4dDrIAO8KY6zg_4UaaOGm5oc",
    authDomain: "gotravel-68bf3.firebaseapp.com",
    projectId: "gotravel-68bf3",
    storageBucket: "gotravel-68bf3.firebaseapp.com",
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
        const destinationsCollection = collection(db, "destinations");
        const querySnapshot = await getDocs(destinationsCollection);
        
        allDestinations = [];
        querySnapshot.forEach((doc) => {
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
        return destination.name?.toLowerCase().includes(searchTerm) || 
               destination.description?.toLowerCase().includes(searchTerm) ||
               destination.location?.toLowerCase().includes(searchTerm);
    });
}

// Export necessary functions and variables
export { 
    db,
    fetchDestinations,
    filterDestinations,
    allDestinations
};
