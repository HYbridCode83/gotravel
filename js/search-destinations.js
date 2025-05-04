import { db, fetchDestinations, filterDestinations, displaySuggestions } from './firebase-init.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = document.getElementById('search-bar');
    const suggestionsList = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');

    // Initial fetch of destinations
    await fetchDestinations();

    // Search as you type functionality
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.trim();
        if (searchTerm.length >= 2) {
            const filteredDestinations = filterDestinations(searchTerm);
            displaySuggestions(filteredDestinations);
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    // Handle search button click
    searchButton.addEventListener('click', () => {
        handleSearch();
    });

    // Handle enter key in search bar
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== searchBar && e.target !== suggestionsList) {
            suggestionsList.style.display = 'none';
        }
    });

    // Function to display suggestions
    function displaySuggestions(filteredDestinations) {
        suggestionsList.innerHTML = '';
        
        if (filteredDestinations.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }
        
        filteredDestinations.forEach(destination => {
            const li = document.createElement('li');
            li.textContent = destination.name;
            li.addEventListener('click', () => {
                searchBar.value = destination.name;
                suggestionsList.style.display = 'none';
                handleSearch();
            });
            suggestionsList.appendChild(li);
        });
        
        suggestionsList.style.display = 'block';
    }

    // Function to handle search execution
    function handleSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            window.location.href = `search-results.html?query=${encodeURIComponent(searchTerm)}`;
        }
    }
});
