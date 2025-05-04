import { fetchDestinations, filterDestinations } from './firebase-init.js';

export function initializeSearchBar() {
    const searchBar = document.getElementById('search-bar');
    const suggestionsList = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');

    if (!searchBar || !suggestionsList || !searchButton) {
        console.error('Search elements not found');
        return;
    }

    // Initial fetch of destinations
    fetchDestinations();

    // Search as you type functionality
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.trim();
        if (searchTerm.length >= 2) {
            const filteredDestinations = filterDestinations(searchTerm);
            displaySuggestions(filteredDestinations, searchBar, suggestionsList);
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    // Handle search button click
    searchButton.addEventListener('click', () => {
        handleSearch(searchBar);
    });

    // Handle enter key in search bar
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchBar);
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== searchBar && e.target !== suggestionsList) {
            suggestionsList.style.display = 'none';
        }
    });
}

function displaySuggestions(filteredDestinations, searchBar, suggestionsList) {
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
            handleSearch(searchBar);
        });
        suggestionsList.appendChild(li);
    });
    
    suggestionsList.style.display = 'block';
}

function handleSearch(searchBar) {
    const searchTerm = searchBar.value.trim();
    if (searchTerm) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('search-results.html')) {
            window.location.href = `search-results.html?query=${encodeURIComponent(searchTerm)}`;
        } else {
            // If we're already on the search results page, just update the URL and reload
            window.location.search = `?query=${encodeURIComponent(searchTerm)}`;
        }
    }
}
