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
    const searchButton = document.getElementById('search-button');
    
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
                            // Redirect to search results with this destination
                            window.location.href = `search-results.html?query=${encodeURIComponent(destination)}`;
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
        
        // Handle search button click
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchBar.value.trim();
                if (query) {
                    window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
                }
            });
        }
        
        // Handle Enter key in search bar
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchBar.value.trim();
                if (query) {
                    window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
                }
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
