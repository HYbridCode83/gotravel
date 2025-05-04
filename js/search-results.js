// Import only what we need
import { db, fetchDestinations, filterDestinations } from './firebase-init.js';
import DestinationFactory from './models/DestinationFactory.js';

// Main search functionality
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Search results page loaded"); // Debug log
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    
    if (searchQuery) {
        console.log("Searching for:", searchQuery); // Debug log
        try {
            // First fetch all destinations
            await fetchDestinations();
            
            // Then filter them based on search query
            const filteredDestinations = filterDestinations(searchQuery)
                .map(destinationData => DestinationFactory.createDestination(destinationData));
            
            console.log("Found destinations:", filteredDestinations.length); // Debug log
            displayResults(searchQuery, filteredDestinations);
        } catch (error) {
            console.error("Error searching destinations:", error);
            displayResults(searchQuery, []);
        }
    } else {
        console.log("No search query provided"); // Debug log
        displayResults("", []);
    }
});

function displayResults(searchQuery, results) {
    console.log("Displaying results"); // Debug log
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
        const card = createDestinationCard(destination);
        searchResultsContainer.appendChild(card);
    });
}

function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    const imageUrl = destination.imageUrl || 'images/default.jpg';
    const name = destination.name || 'Unknown Location';
    const description = destination.description || 'No description available';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${name}" onerror="this.src='images/default.jpg'">
        <div class="card-content">
            <h3>${name}</h3>
            <p>${description}</p>
            <p class="category">${destination.category || 'General'}</p>
            ${getSpecificDetails(destination)}
        </div>
    `;
    
    return card;
}

function getSpecificDetails(destination) {
    if (!destination.category) return '';
    
    switch(destination.category.toLowerCase()) {
        case 'cultural':
            return `
                <div class="destination-details cultural">
                    <p>Culture: ${destination.culture || 'N/A'}</p>
                    <p>Events: ${destination.events ? destination.events.join(', ') : 'N/A'}</p>
                </div>
            `;
        case 'historical':
            return `
                <div class="destination-details historical">
                    <p>Year Built: ${destination.yearBuilt || 'N/A'}</p>
                    <p>Significance: ${destination.historicalSignificance || 'N/A'}</p>
                </div>
            `;
        case 'nature':
            return `
                <div class="destination-details nature">
                    <p>Best Season: ${destination.bestSeason || 'N/A'}</p>
                    <p>Activities: ${destination.activities ? destination.activities.join(', ') : 'N/A'}</p>
                </div>
            `;
        default:
            return '';
    }
}

// Add error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        e.target.src = 'images/default.jpg';
    }
}, true);
