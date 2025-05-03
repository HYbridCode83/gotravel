import { getDatabase, ref, onValue } from "firebase/database";

// Get references to the HTML elements
const searchBar = document.getElementById("search-bar");
const suggestions = document.getElementById("suggestions");

// Add an event listener to the search bar
searchBar.addEventListener("input", () => {
    const searchValue = searchBar.value.toLowerCase();
    const db = getDatabase();
    const destinationsRef = ref(db, 'destinations/');

    // Fetch data from Firebase
    onValue(destinationsRef, (snapshot) => {
        const data = snapshot.val();
        suggestions.innerHTML = ''; // Clear previous results

        // Iterate through the data and filter results
        for (const key in data) {
            if (data[key].name.toLowerCase().includes(searchValue)) {
                const li = document.createElement("li");
                li.textContent = data[key].name;
                suggestions.appendChild(li);
            }
        }
    });
});
