import { getDatabase, ref, onValue } from "firebase/database";

// Get references to the HTML elements
const searchBar = document.getElementById("search-bar");
const suggestions = document.getElementById("suggestions");

// Add an event listener to the search bar
searchBar.addEventListener("input", () => {
    const searchValue = searchBar.value.trim().toLowerCase();
    suggestions.innerHTML = ''; // Clear previous results

    if (searchValue === "") {
        // Exit if search bar is empty
        return;
    }

    const db = getDatabase();
    const destinationsRef = ref(db, 'destinations/');

    // Fetch data from Firebase
    onValue(destinationsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            console.error("No data found in Firebase.");
            return;
        }

        // Iterate through the data and filter results
        let foundMatch = false;
        for (const key in data) {
            const destinationName = data[key]?.name?.toLowerCase() || ""; // Handle undefined or null fields
            if (destinationName.includes(searchValue)) {
                foundMatch = true;
                const li = document.createElement("li");
                li.textContent = data[key].name;
                suggestions.appendChild(li);
            }
        }

        if (!foundMatch) {
            const noResults = document.createElement("li");
            noResults.textContent = "No matching destinations found.";
            suggestions.appendChild(noResults);
        }
    }, (error) => {
        console.error("Error fetching data from Firebase:", error);
    });
});
