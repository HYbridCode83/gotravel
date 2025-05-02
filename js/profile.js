import { auth, db } from './firebase-config.js';
import { 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { 
    doc, 
    getDoc, 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        updateProfileUI(user);
        loadSavedDestinations(user.uid);
        loadSearchHistory(user.uid);
    } else {
        // User is signed out
        window.location.href = 'login.html';
    }
});

// Update Profile UI
async function updateProfileUI(user) {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');

    // Get user profile data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() || {};

    profileName.textContent = userData.displayName || user.displayName || 'User';
    profileEmail.textContent = user.email;
    profileAvatar.src = userData.photoURL || user.photoURL || 'images/default-avatar.png';
}

// Load Saved Destinations
async function loadSavedDestinations(userId) {
    const savedDestinationsDiv = document.getElementById('savedDestinations');
    const savedDestinationsRef = collection(db, `users/${userId}/savedDestinations`);
    const q = query(savedDestinationsRef, orderBy('savedAt', 'desc'), limit(5));

    try {
        const querySnapshot = await getDocs(q);
        savedDestinationsDiv.innerHTML = ''; // Clear existing content

        if (querySnapshot.empty) {
            savedDestinationsDiv.innerHTML = '<p>No saved destinations yet.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const destination = doc.data();
            const destinationElement = document.createElement('div');
            destinationElement.className = 'saved-destination';
            destinationElement.innerHTML = `
                <img src="${destination.imageUrl}" alt="${destination.name}" class="destination-image">
                <div>
                    <h3>${destination.name}</h3>
                    <p>Saved on ${new Date(destination.savedAt.toDate()).toLocaleDateString()}</p>
                </div>
            `;
            savedDestinationsDiv.appendChild(destinationElement);
        });
    } catch (error) {
        console.error("Error loading saved destinations:", error);
        savedDestinationsDiv.innerHTML = '<p>Error loading saved destinations.</p>';
    }
}

// Load Search History
async function loadSearchHistory(userId) {
    const searchHistoryDiv = document.getElementById('searchHistory');
    const searchHistoryRef = collection(db, `users/${userId}/searchHistory`);
    const q = query(searchHistoryRef, orderBy('searchedAt', 'desc'), limit(5));

    try {
        const querySnapshot = await getDocs(q);
        searchHistoryDiv.innerHTML = ''; // Clear existing content

        if (querySnapshot.empty) {
            searchHistoryDiv.innerHTML = '<p>No search history yet.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const search = doc.data();
            const searchElement = document.createElement('div');
            searchElement.className = 'search-history-item';
            searchElement.innerHTML = `
                <p>${search.query}</p>
                <small>${new Date(search.searchedAt.toDate()).toLocaleDateString()}</small>
            `;
            searchHistoryDiv.appendChild(searchElement);
        });
    } catch (error) {
        console.error("Error loading search history:", error);
        searchHistoryDiv.innerHTML = '<p>Error loading search history.</p>';
    }
}

// Handle Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error signing out:", error);
        alert('Error signing out. Please try again.');
    }
});

// Handle Edit Profile
document.getElementById('editProfileBtn').addEventListener('click', () => {
    // Implement profile editing functionality
    alert('Profile editing will be implemented soon!');
});
