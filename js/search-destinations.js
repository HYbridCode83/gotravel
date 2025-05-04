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

async function searchDestinations(query) {
    try {
        console.log("Starting search with query:", query);
        const destinationsRef = collection(db, "destinations");
        console.log("Getting documents from Firebase...");
        const querySnapshot = await getDocs(destinationsRef);
        
        const results = [];
        console.log("Total documents found:", querySnapshot.size);
        
        querySnapshot.forEach((doc) => {
            console.log("Processing document:", doc.id);
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
        
        console.log("Search results:", results.length);
        return results;
    } catch (error) {
        console.error("Detailed error in searchDestinations:", error);
        return [];
    }
}
