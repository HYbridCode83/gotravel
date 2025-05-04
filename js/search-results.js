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

function displayResults(searchQuery, results) {
    console.log('Displaying results for:', searchQuery);
    console.log('Number of results:', results.length);
    console.log('Results:', results); 
    const searchResultsContainer = document.getElementById('search-results');
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

    // Group results by category
    const groupedResults = {
        cultural: results.filter(d => d.category === 'cultural'),
        historical: results.filter(d => d.category === 'historical'),
        nature: results.filter(d => d.category === 'nature')
    };

    // Create categories container
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-container';

    // Display each category
    Object.entries(groupedResults).forEach(([category, destinations]) => {
        if (destinations.length > 0) {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            categorySection.innerHTML = `
                <h3 class="category-title">
                    <i class="fas ${getCategoryIcon(category)}"></i>
                    ${capitalizeFirstLetter(category)} Destinations
                </h3>
                <div class="results-grid"></div>
            `;

            const grid = categorySection.querySelector('.results-grid');
            
            destinations.forEach(destination => {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <img src="${destination.imageUrl || 'images/default.jpg'}" 
                         alt="${destination.name}" 
                         class="result-image"
                         onerror="this.src='images/default.jpg'">
                    <div class="result-content">
                        <h3 class="result-title">${destination.name}</h3>
                        <div class="result-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${destination.location || 'Location not specified'}</span>
                        </div>
                        <p class="result-description">${destination.description || 'No description available'}</p>
                        <a href="#" class="view-more">View More</a>
                    </div>
                `;

                // Add click event for view more button
                const viewMoreBtn = card.querySelector('.view-more');
                viewMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showDestinationDetails(destination);
                });

                grid.appendChild(card);
            });

            categoriesContainer.appendChild(categorySection);
        }
    });

    searchResultsContainer.appendChild(categoriesContainer);
}

// Helper functions
function getCategoryIcon(category) {
    const icons = {
        cultural: 'fa-theater-masks',
        historical: 'fa-landmark',
        nature: 'fa-tree'
    };
    return icons[category] || 'fa-map-marker-alt';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showDestinationDetails(destination) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h2>${destination.name}</h2>
                <div class="category-tag">
                    <i class="fas ${getCategoryIcon(destination.category)}"></i>
                    ${capitalizeFirstLetter(destination.category || 'uncategorized')}
                </div>
            </div>
            <img src="${destination.imageUrl || 'images/default.jpg'}" 
                 alt="${destination.name}" 
                 style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">
            <p style="margin: 20px 0;">${destination.description || 'No description available'}</p>
            ${destination.locationUrl ? `
                <div class="modal-location">
                    <a href="${destination.locationUrl}" 
                       class="location-link" 
                       target="_blank">
                        <i class="fas fa-map-marker-alt"></i>
                        View Location on Map
                    </a>
                </div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        modal.remove();
    };

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    });
}
