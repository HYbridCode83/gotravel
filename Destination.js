// Initialize Firebase if not already initialized
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const suggestionsList = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');
    let destinations = [];

    // Fetch destinations from Firebase
    async function fetchDestinations() {
        try {
            const destinationsRef = collection(db, 'destinations');
            const querySnapshot = await getDocs(destinationsRef);
            destinations = [];
            querySnapshot.forEach((doc) => {
                destinations.push(doc.data());
            });
        } catch (error) {
            console.error("Error fetching destinations:", error);
        }
    }

    // Initial fetch
    fetchDestinations();

    // Search functionality
    searchBar.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        if (searchText.length > 0) {
            const filteredDestinations = destinations.filter(dest => 
                dest.name.toLowerCase().includes(searchText) ||
                dest.description.toLowerCase().includes(searchText)
            );
            showSuggestions(filteredDestinations);
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    // Show suggestions
    function showSuggestions(filteredDestinations) {
        suggestionsList.innerHTML = '';
        if (filteredDestinations.length > 0) {
            filteredDestinations.forEach(dest => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="destination-info">
                        <h3>${dest.name}</h3>
                        <p>${dest.description.substring(0, 100)}...</p>
                    </div>
                `;
                li.addEventListener('click', () => {
                    window.location.href = `destination.html?id=${dest.id}`;
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    }

    // Handle search button click
    searchButton.addEventListener('click', function() {
        const searchText = searchBar.value.toLowerCase();
        if (searchText.length > 0) {
            // Implement search results page navigation here
            window.location.href = `search-results.html?q=${encodeURIComponent(searchText)}`;
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBar.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.style.display = 'none';
        }
    });
});
