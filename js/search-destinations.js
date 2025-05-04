import { db, fetchDestinations, filterDestinations, displaySuggestions } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = document.getElementById('search-bar');
    const suggestionsList = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');

    if (!searchBar || !suggestionsList || !searchButton) {
        console.error('Search elements not found');
        return;
    }

    // Initial fetch of destinations
    await fetchDestinations();

    // Search as you type functionality
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.trim();
        if (searchTerm.length >= 2) {
            const filteredDestinations = filterDestinations(searchTerm);
            displaySuggestions(filteredDestinations, suggestionsList);
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

    // Function to handle search execution
    function handleSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            window.location.href = `search-results.html?query=${encodeURIComponent(searchTerm)}`;
        }
    }
});
