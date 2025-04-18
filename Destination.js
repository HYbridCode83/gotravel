const destinations = [
    "Amsterdam",
    "Barcelona",
    "Copenhagen",
    "Dubai",
    "Edinburgh",
    "Florence",
    "Geneva",
    "Helsinki",
    "Istanbul",
    "Jakarta",
    "Kyoto",
    "Lisbon",
    "Madrid",
    "New York",
    "Oslo",
    "Paris",
    "Quebec",
    "Rome",
    "Sydney",
    "Tokyo",
    "Utrecht",
    "Vienna",
    "Warsaw",
    "Xian",
    "Yokohama",
    "Zurich"
];

const searchBar = document.getElementById('search-bar');
const suggestions = document.getElementById('suggestions');

searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    suggestions.innerHTML = '';

    if (query) {
        const filteredDestinations = destinations.filter(destination =>
            destination.toLowerCase().includes(query)
        );

        filteredDestinations.forEach(destination => {
            const li = document.createElement('li');
            li.textContent = destination;
            li.addEventListener('click', () => {
                searchBar.value = destination; // Set the clicked suggestion to the input
                suggestions.innerHTML = ''; // Clear the suggestions list
            });
            suggestions.appendChild(li);
        });
    }
});
