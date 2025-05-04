import { db, fetchDestinations, filterDestinations } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Search results page loaded");
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    
    if (searchQuery) {
        console.log("Searching for:", searchQuery);
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

function displayResults(searchQuery, results) {
    const searchResultsContainer = document.getElementById('search-results');
    if (!searchResultsContainer) {
        console.error('Search results container not found!');
        return;
    }
    
    searchResultsContainer.innerHTML = '';
    
    // Add search title
    const searchTitle = document.createElement('h2');
    searchTitle.className = 'search-title';
    searchTitle.innerHTML = `Search results for: <span class="search-query">${searchQuery}</span>`;
    searchResultsContainer.appendChild(searchTitle);
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML += `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No destinations found</h3>
                <p>We couldn't find any destinations matching "${searchQuery}"</p>
                <p>Try a different search term or browse our <a href="index.html#destinations">popular destinations</a>.</p>
            </div>
        `;
        return;
    }
    
    // Create result cards
    results.forEach(destination => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <img src="${destination.imageUrl || 'images/default.jpg'}" alt="${destination.name}" onerror="this.src='images/default.jpg'">
            <div class="card-content">
                <h3>${destination.name}</h3>
                <p>${destination.description || 'No description available'}</p>
                <p class="category">${destination.category || 'General'}</p>
            </div>
        `;
        searchResultsContainer.appendChild(card);
    });
}
