import { db, fetchDestinations, filterDestinations } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Search results page loaded");
    
    // Initialize search functionality
    initializeSearch();
    
    // Get and display initial search results
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    
    if (searchQuery) {
        try {
            await fetchDestinations();
            const filteredDestinations = filterDestinations(searchQuery);
            displayResults(searchQuery, filteredDestinations);
        } catch (error) {
            console.error("Error searching destinations:", error);
            displayResults(searchQuery, []);
        }
    } else {
        console.log("No search query provided");
        displayResults("", []);
    }
});

function initializeSearch() {
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const suggestionsList = document.getElementById('suggestions');

    if (!searchBar || !searchButton || !suggestionsList) {
        console.error('Search elements not found');
        return;
    }

    // Search as you type
    searchBar.addEventListener('input', async () => {
        const searchTerm = searchBar.value.trim();
        if (searchTerm.length >= 2) {
            await fetchDestinations(); // Ensure destinations are loaded
            const filteredDestinations = filterDestinations(searchTerm);
            displaySuggestions(filteredDestinations, suggestionsList);
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    // Handle search button click
    searchButton.addEventListener('click', () => {
        performSearch(searchBar.value);
    });

    // Handle Enter key
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchBar.value);
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== searchBar && e.target !== suggestionsList) {
            suggestionsList.style.display = 'none';
        }
    });
}

function performSearch(searchTerm) {
    if (!searchTerm.trim()) return;
    
    // Update URL with new search term
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('query', searchTerm);
    window.location.href = newUrl.toString();
}

function displaySuggestions(destinations, suggestionsList) {
    suggestionsList.innerHTML = '';
    
    if (!destinations.length) {
        suggestionsList.style.display = 'none';
        return;
    }
    
    destinations.forEach(destination => {
        const li = document.createElement('li');
        li.textContent = destination.name;
        li.addEventListener('click', () => {
            const searchBar = document.getElementById('search-bar');
            if (searchBar) {
                searchBar.value = destination.name;
                performSearch(destination.name);
            }
            suggestionsList.style.display = 'none';
        });
        suggestionsList.appendChild(li);
    });
    
    suggestionsList.style.display = 'block';
}
