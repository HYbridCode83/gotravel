// Import Firebase functions
import { db } from './firebase-init.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import DestinationFactory from './models/DestinationFactory.js';
import { HistoricalDestination } from './models/HistoricalDestination.js';
import { NatureDestination } from './models/NatureDestination.js';
import { CulturalDestination } from './models/CulturalDestination.js';

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

// DOM elements
const searchResultsContainer = document.getElementById('search-results');
const searchBar = document.getElementById('search-bar');
const suggestionsList = document.getElementById('suggestions');
const searchButton = document.getElementById('search-button');

// Get search query from URL
function getSearchQueryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('query');
}

// Format search results
function displayResults(searchQuery, results) {
    // Clear loading indicator
    searchResultsContainer.innerHTML = '';
    
    // Add search title
    const searchTitle = document.createElement('h2');
    searchTitle.className = 'search-title';
    searchTitle.innerHTML = `Search results for: <span class="search-query">${searchQuery}</span>`;
    searchResultsContainer.appendChild(searchTitle);
    
    // Display results or no results message
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
    
    // Create result cards for each destination
    results.forEach(destination => {
        // Use default image if none provided
        const imageUrl = destination.imageUrl || 'images/sarawak-rainforest.jpg';
         // Get special features based on destination type
        let specialFeatures = '';
        if (destination instanceof HistoricalDestination) {
            specialFeatures = `
                <div class="historical-features">
                    <p><i class="fas fa-landmark"></i> Built in ${destination.yearBuilt}</p>
                    <p>${destination.historicalSignificance}</p>
                </div>
            `;
        } else if (destination instanceof NatureDestination) {
            specialFeatures = `
                <div class="nature-features">
                    <p><i class="fas fa-tree"></i> Best Season: ${destination.bestSeason}</p>
                    <p><i class="fas fa-hiking"></i> Activities: ${destination.activities.join(', ')}</p>
                    ${destination.flora.length ? `<p><i class="fas fa-leaf"></i> Flora: ${destination.flora.join(', ')}</p>` : ''}
                    ${destination.fauna.length ? `<p><i class="fas fa-paw"></i> Fauna: ${destination.fauna.join(', ')}</p>` : ''}
                </div>
            `;
        } else if (destination instanceof CulturalDestination) {
            specialFeatures = `
                <div class="cultural-features">
                    <p><i class="fas fa-theater-masks"></i> Culture: ${destination.culture}</p>
                    ${destination.events.length ? `<p><i class="fas fa-calendar-alt"></i> Events: ${destination.events.join(', ')}</p>` : ''}
                    ${destination.traditions.length ? `<p><i class="fas fa-scroll"></i> Traditions: ${destination.traditions.join(', ')}</p>` : ''}
                </div>
            `;
        }
        
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        resultCard.innerHTML = `
            <img src="${imageUrl}" alt="${destination.name}" class="result-image">
            <div class="result-content">
                <h3 class="result-title">${destination.name}</h3>
                <div class="result-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${destination.location || 'Sarawak, Malaysia'}</span>
                </div>
                <p class="result-description">${destination.description}</p>
                ${specialFeatures}
                <a href="#" class="view-more" data-id="${destination.id}">View Details</a>
            </div>
        `;
        
        // Add click event for view more button
        const viewMoreBtn = resultCard.querySelector('.view-more');
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showDestinationDetails(destination);
        });
        
        searchResultsContainer.appendChild(resultCard);
    });
}

// Show destination details in a modal or expanded view
function showDestinationDetails(destination) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modalOverlay.style.zIndex = '2000';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';


    // Get special features based on destination type
    let specialFeaturesHTML = '';
    if (destination instanceof HistoricalDestination) {
    specialFeaturesHTML = `
        <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Historical Details</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-landmark" style="margin-right: 8px; color: #f39c12;"></i>
                    <span>Built in: ${destination.yearBuilt}</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-book-reader" style="margin-right: 8px; color: #f39c12;"></i>
                    <span>Significance: ${destination.historicalSignificance}</span>
                </div>
            </div>
        </div>
    `;
} else if (destination instanceof NatureDestination) {
    specialFeaturesHTML = `
        <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Nature Details</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-sun" style="margin-right: 8px; color: #f39c12;"></i>
                    <span>Best Season: ${destination.bestSeason}</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-hiking" style="margin-right: 8px; color: #f39c12;"></i>
                    <span>Activities: ${destination.activities.join(', ')}</span>
                </div>
                ${destination.flora.length ? `
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-leaf" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Flora: ${destination.flora.join(', ')}</span>
                    </div>
                ` : ''}
                ${destination.fauna.length ? `
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-paw" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Fauna: ${destination.fauna.join(', ')}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
} else if (destination instanceof CulturalDestination) {
    specialFeaturesHTML = `
        <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Cultural Details</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-theater-masks" style="margin-right: 8px; color: #f39c12;"></i>
                    <span>Culture: ${destination.culture}</span>
                </div>
                ${destination.events.length ? `
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-calendar-alt" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Events: ${destination.events.join(', ')}</span>
                    </div>
                ` : ''}
                ${destination.traditions.length ? `
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-scroll" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Traditions: ${destination.traditions.join(', ')}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}
    
    // Format attractions list if available
    let attractionsHTML = '';
    if (destination.attractions && destination.attractions.length > 0) {
        attractionsHTML = `
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Top Attractions</h4>
                <ul style="padding-left: 20px;">
                    ${destination.attractions.map(attraction => `
                        <li style="margin-bottom: 5px;">${attraction}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Create details for info like bestTime, budget, etc. if available
    let detailsHTML = '';
    
    if (destination.bestTimeToVisit || destination.budget || destination.duration || destination.category) {
        detailsHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px;">
                ${destination.bestTimeToVisit ? `
                    <div style="display: flex; align-items: center;">
                        <i class="far fa-calendar-alt" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Best Time: ${destination.bestTimeToVisit}</span>
                    </div>` : ''}
                
                ${destination.budget ? `
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-dollar-sign" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Budget: ${destination.budget}</span>
                    </div>` : ''}
                    
                ${destination.duration ? `
                    <div style="display: flex; align-items: center;">
                        <i class="far fa-clock" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Recommended: ${destination.duration}</span>
                    </div>` : ''}
                    
                ${destination.category ? `
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-tag" style="margin-right: 8px; color: #f39c12;"></i>
                        <span>Category: ${destination.category}</span>
                    </div>` : ''}
            </div>
        `;
    }
    
    // Create modal content
    modalOverlay.innerHTML = `
        <div style="background-color: white; width: 90%; max-width: 700px; max-height: 90vh; border-radius: 8px; overflow-y: auto; position: relative;">
            <button id="close-modal" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer; z-index: 2001;">
                <i class="fas fa-times"></i>
            </button>
            
            <img src="${destination.imageUrl || 'images/sarawak-rainforest.jpg'}" alt="${destination.name}" 
                style="width: 100%; height: 250px; object-fit: cover;">
            
            <div style="padding: 20px;">
                <h2 style="font-size: 28px; margin-bottom: 10px;">${destination.name}</h2>
                
                <div style="display: flex; align-items: center; margin-bottom: 15px; font-size: 16px; color: #666;">
                    <i class="fas fa-map-marker-alt" style="color: #f39c12; margin-right: 8px;"></i>
                    <span>${destination.location || 'Sarawak, Malaysia'}</span>
                </div>
                
                <div style="line-height: 1.6; margin-bottom: 15px;">
                    ${destination.description || 'No description available.'}
                </div>

                ${specialFeaturesHTML}
                ${detailsHTML}
                ${attractionsHTML}
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modalOverlay);
    
    // Add event listener to close modal
    document.getElementById('close-modal').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
}

// Search in Firebase
async function searchDestinations(query) {
    try {
        const destinationsRef = collection(db, "destinations");
        const querySnapshot = await getDocs(destinationsRef);
        
        const results = [];
        querySnapshot.forEach((doc) => {
            const firebaseData = {
                id: doc.id,
                ...doc.data()
            };
            
            // Create appropriate destination type using factory
            const destination = DestinationFactory.createDestination(firebaseData);
            const searchableText = `${destination.name} ${destination.description} ${destination.location}`.toLowerCase();
            
            if (searchableText.includes(query.toLowerCase())) {
                results.push(destination);
            }
        });
        
        return results;
    } catch (error) {
        console.error("Error searching destinations:", error);
        return [];
    }
}

// Initialize search results page
async function initSearchResults() {
    const searchQuery = getSearchQueryFromUrl();
    
    if (!searchQuery) {
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <h3>No search query provided</h3>
                <p>Please enter a search term and try again.</p>
                <a href="index.html" class="view-more">Return to Homepage</a>
            </div>
        `;
        return;
    }
    
    // Set search bar value to current query
    if (searchBar) {
        searchBar.value = searchQuery;
    }
    
    // Search destinations
    const results = await searchDestinations(searchQuery);
    
    // Display results
    displayResults(searchQuery, results);
}

// Initialize page
document.addEventListener('DOMContentLoaded', initSearchResults);

// Set up search functionality for the header search bar
let allDestinations = [];

// Fetch all destinations for search
async function fetchAllDestinations() {
    try {
        const destinationsCollection = collection(db, "destinations");
        const querySnapshot = await getDocs(destinationsCollection);
        
        allDestinations = [];
        querySnapshot.forEach((doc) => {
            const firebaseData = {
                id: doc.id,
                ...doc.data()
            };
            const destination = DestinationFactory.createDestination(firebaseData);
            allDestinations.push(destination);
        });
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

// Display suggestions
function displaySuggestions(filteredDestinations) {
    if (!suggestionsList) return;
    
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
            searchBar.value = destination.name;
            suggestionsList.style.display = 'none';
            // Show destination details directly
            showDestinationDetails(destination);
        });
        suggestionsList.appendChild(li);
    });
    
    // Show suggestions
    suggestionsList.style.display = 'block';
}

// Search function
function performSearch() {
    if (!searchBar || !suggestionsList) return;
    
    const searchTerm = searchBar.value.trim();
    if (searchTerm.length >= 2) {
        const filteredDestinations = filterDestinations(searchTerm);
        displaySuggestions(filteredDestinations);
    } else {
        suggestionsList.style.display = 'none';
    }
}

// Set up search event listeners
if (searchBar && searchButton) {
    // Input event
    searchBar.addEventListener('input', performSearch);
    
    // Focus event
    searchBar.addEventListener('focus', () => {
        if (searchBar.value.trim().length >= 2) {
            performSearch();
        }
    });
    
    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (suggestionsList && e.target !== searchBar && e.target !== suggestionsList) {
            suggestionsList.style.display = 'none';
        }
    });
    
    // Search button click
    searchButton.addEventListener('click', () => {
        const query = searchBar.value.trim();
        if (query) {
            window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
        }
    });
    
    // Enter key in search bar
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBar.value.trim();
            if (query) {
                window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
            }
        }
    });
    
    // Fetch all destinations for search
    fetchAllDestinations();
}
