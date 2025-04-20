const destinations = [
    "Kuching",
    "Sibu",
    "Miri",
    "Bintulu",
    "Sri Aman",
    "Serian",
    "Mukah",
    "Kapit",
    "Betong",
    "Limbang",
    "Kota Samarahan",
    "Sarikei"
    // You can add more destinations from Sarawak or Malaysia if needed
];

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const suggestions = document.getElementById('suggestions');
    
    if (searchBar && suggestions) {
        searchBar.addEventListener('input', () => {
            const query = searchBar.value.toLowerCase();
            suggestions.innerHTML = '';
            
            if (query) {
                const filteredDestinations = destinations.filter(destination =>
                    destination.toLowerCase().includes(query)
                );
                
                if (filteredDestinations.length > 0) {
                    suggestions.style.display = 'block';
                    
                    filteredDestinations.forEach(destination => {
                        const li = document.createElement('li');
                        li.textContent = destination;
                        li.addEventListener('click', () => {
                            searchBar.value = destination;
                            suggestions.style.display = 'none';
                        });
                        suggestions.appendChild(li);
                    });
                } else {
                    suggestions.style.display = 'none';
                }
            } else {
                suggestions.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== searchBar) {
                suggestions.style.display = 'none';
            }
        });
    }
});

// Firebase search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase (your existing Firebase initialization code)
    
    // Search form functionality
    const searchForm = document.getElementById('search-form');
    const searchBar = document.getElementById('search-bar');
    const suggestionsList = document.getElementById('suggestions');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchBar.value.trim();
            if (query !== '') {
                // Redirect to search results page with query parameter
                window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Auto-suggestions functionality (optional)
    if (searchBar && suggestionsList) {
        searchBar.addEventListener('input', async function() {
            const query = searchBar.value.toLowerCase().trim();
            
            if (query.length > 1) {
                try {
                    // Get destinations from Firebase
                    const querySnapshot = await getDocs(collection(db, "destinations"));
                    const matches = [];
                    
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.name.toLowerCase().includes(query)) {
                            matches.push(data.name);
                        }
                    });
                    
                    // Show suggestions
                    if (matches.length > 0) {
                        suggestionsList.innerHTML = '';
                        suggestionsList.style.display = 'block';
                        
                        matches.forEach(match => {
                            const li = document.createElement('li');
                            li.textContent = match;
                            li.addEventListener('click', () => {
                                searchBar.value = match;
                                suggestionsList.style.display = 'none';
                            });
                            suggestionsList.appendChild(li);
                        });
                    } else {
                        suggestionsList.style.display = 'none';
                    }
                } catch (error) {
                    console.error("Error getting suggestions: ", error);
                }
            } else {
                suggestionsList.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== searchBar) {
                suggestionsList.style.display = 'none';
            }
        });
    }
});
