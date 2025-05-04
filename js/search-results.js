// Clean imports
import { db } from './firebase-init.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import DestinationFactory from './models/DestinationFactory.js';
import { HistoricalDestination } from './models/HistoricalDestination.js';
import { NatureDestination } from './models/NatureDestination.js';
import { CulturalDestination } from './models/CulturalDestination.js';

// Main search functionality
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Search results page loaded"); // Debug log
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    
    if (searchQuery) {
        console.log("Searching for:", searchQuery); // Debug log
        try {
            const destinationsRef = collection(db, "destinations");
            const querySnapshot = await getDocs(destinationsRef);
            const destinations = [];
            
            querySnapshot.forEach((doc) => {
                const destinationData = { id: doc.id, ...doc.data() };
                if (destinationData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    destinationData.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                    destinations.push(DestinationFactory.createDestination(destinationData));
                }
            });
            
            console.log("Found destinations:", destinations.length); // Debug log
            displayResults(searchQuery, destinations);
        } catch (error) {
            console.error("Error searching destinations:", error);
            displayResults(searchQuery, []);
        }
    } else {
        console.log("No search query provided"); // Debug log
        displayResults("", []);
    }
});

// Display results function
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

// Create destination card function
function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    // Add null checks and default values
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

// Get specific details based on destination type
function getSpecificDetails(destination) {
    if (!destination.category) return '';
    
    switch(destination.category.toLowerCase()) {
        case 'cultural':
            return `
                <div class="destination-details cultural">
                    <p><i class="fas fa-culture"></i> Culture: ${destination.culture || 'N/A'}</p>
                    <p><i class="fas fa-calendar"></i> Events: ${destination.events ? destination.events.join(', ') : 'N/A'}</p>
                </div>
            `;
        case 'historical':
            return `
                <div class="destination-details historical">
                    <p><i class="fas fa-landmark"></i> Year Built: ${destination.yearBuilt || 'N/A'}</p>
                    <p><i class="fas fa-info-circle"></i> Significance: ${destination.historicalSignificance || 'N/A'}</p>
                </div>
            `;
        case 'nature':
            return `
                <div class="destination-details nature">
                    <p><i class="fas fa-sun"></i> Best Season: ${destination.bestSeason || 'N/A'}</p>
                    <p><i class="fas fa-hiking"></i> Activities: ${destination.activities ? destination.activities.join(', ') : 'N/A'}</p>
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
