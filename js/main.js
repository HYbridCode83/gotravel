// Import Firebase functions
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// Firebase configuration 
import { db } from './firebase-config.js';

// Initialize auth
const auth = getAuth();

// Fallback destinations array (in case Firebase fetch fails)
const staticDestinations = [
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
];

// Store destinations fetched from Firebase
let destinations = [...staticDestinations];

// Fetch destinations from Firebase
async function fetchDestinations() {
    try {
        const destinationsCollection = collection(db, "destinations");
        const querySnapshot = await getDocs(destinationsCollection);
        
        // If we get results, update the destinations array
        if (!querySnapshot.empty) {
            destinations = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.name) {
                    destinations.push(data.name);
                }
            });
        }
        console.log("Destinations loaded:", destinations.length);
    } catch (error) {
        console.error("Error getting destinations:", error);
        // Keep using the static destinations if Firebase fetch fails
    }
}

// Add digital adoption tracking
function initAdoption() {
    const auth = firebase.auth();
    
    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserSetup(user);
        }
    });
}

// Check if user needs setup
async function checkUserSetup(user) {
    const userDoc = await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get();

    if (!userDoc.exists || !userDoc.data().preferences) {
        showQuickSetup();
    }
}

// Track interactions with destinations
function trackDestinationInteraction() {
    document.querySelectorAll('.place-card').forEach(card => {
        card.addEventListener('click', () => {
            const user = auth.currentUser;
            if (user) {
                adoption.updateInteraction(user.uid, 'viewed_destination');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const suggestions = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');
    
    // Initialize features
    fetchDestinations();
    initAdoption();
    trackDestinationInteraction();
    
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

// Add this after your existing functions in main.js
function showQuickSetup() {
    const quickSetupDiv = document.getElementById('quickSetup');
    if (quickSetupDiv) {
        quickSetupDiv.style.display = 'block';
    }
}

function hideQuickSetup() {
    const quickSetupDiv = document.getElementById('quickSetup');
    if (quickSetupDiv) {
        quickSetupDiv.style.display = 'none';
    }
}

function toggleInterest(category) {
    const btn = document.getElementById(category);
    if (btn) {
        btn.classList.toggle('active');
        if (userInterests.has(category)) {
            userInterests.delete(category);
        } else {
            userInterests.add(category);
        }
    }
}

async function saveInterests() {
    const user = auth.currentUser;
    if (user) {
        try {
            await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    preferences: Array.from(userInterests)
                });
            hideQuickSetup();
            // Update recommendations after saving preferences
            updateRecommendations();
        } catch (error) {
            console.error('Error saving interests:', error);
        }
    }
}

async function updateRecommendations() {
    const user = auth.currentUser;
    if (user) {
        const recommendations = await adoption.getRecommendations(user.uid);
        displayRecommendations(recommendations);
    }
}

// Add this to your main.js to test preferences
async function testPreferences() {
    const user = auth.currentUser;
    if (user) {
        const prefs = await adoption.getRecommendations(user.uid);
        console.log('User preferences working:', prefs.length > 0);
    }
}

// Add this to test tracking
async function verifyTracking() {
    const user = auth.currentUser;
    if (user) {
        await adoption.updateInteraction(user.uid, 'test_interaction');
        console.log('Tracking test completed');
    }
}

// Add this new function to display recommendations
function displayRecommendations(recommendations) {
    const recommendationsSection = document.getElementById('recommendationsSection');
    const recommendationsGrid = recommendationsSection.querySelector('.recommendations-grid');
    
    if (recommendations && recommendations.length > 0) {
        recommendationsGrid.innerHTML = '';
        recommendations.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML = `
                <img src="${destination.imageUrl || 'images/placeholder.jpg'}" alt="${destination.name}">
                <div class="recommendation-details">
                    <h4>${destination.name}</h4>
                    <p>${destination.description || 'Explore this destination'}</p>
                </div>
            `;
            recommendationsGrid.appendChild(card);
        });
        recommendationsSection.style.display = 'block';
    }
}

// Add these test functions after your existing code
async function testFeatures() {
    const user = auth.currentUser;
    if (!user) {
        console.log('Please sign in first');
        return;
    }

    try {
        // Test metrics
        await metrics.trackEngagement(user.uid, 'test_action');
        console.log('✓ Metrics tracking working');

        // Test achievements
        await achievements.checkAchievements(user.uid);
        console.log('✓ Achievements system working');

        // Test recommendations
        const recommendations = await adoption.getRecommendations(user.uid);
        console.log('✓ Recommendations working:', recommendations.length > 0);

        // Test popular destinations
        await adoption.trackPopularDestinations('Test Destination');
        console.log('✓ Popular destinations tracking working');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Add these functions to main.js
async function trackUserEngagement() {
    const user = auth.currentUser;
    if (!user) return;

    // Track search interactions
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('search', () => {
            adoption.trackAnalytics(user.uid, 'search_performed', {
                query: searchBar.value
            });
        });
    }

    // Track recommendation clicks
    document.querySelectorAll('.recommendation-card').forEach(card => {
        card.addEventListener('click', () => {
            adoption.trackAnalytics(user.uid, 'recommendation_clicked', {
                destinationName: card.querySelector('h4').textContent
            });
        });
    });
}

// Save a destination for the logged-in user
async function saveDestination(destination) {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to save destinations.");

    try {
        const docRef = await addDoc(collection(db, "users", user.uid, "savedDestinations"), destination);
        console.log("Destination saved with ID:", docRef.id);
    } catch (error) {
        console.error("Error saving destination:", error);
    }
}

async function fetchSavedDestinations() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const q = query(collection(db, "users", user.uid, "savedDestinations"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching saved destinations:", error);
        return [];
    }
}

// Add auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        achievements.checkAchievements(user.uid);
        trackUserEngagement();
        // You can update UI elements here to show logged-in state
    } else {
        // User is signed out
        console.log('User is signed out');
        // You can update UI elements here to show logged-out state
    }
    
    
    // Sign up with email and password
async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

// Sign in with email and password
async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}
});

// Add this to the bottom of your main.js
async function verifyAllFeatures() {
    const user = auth.currentUser;
    if (!user) {
        console.log('❌ Please sign in first');
        return;
    }

    // Run tests quietly in the background
    try {
        // Test user setup without affecting UI
        const setupResult = await adoption.setupUser(user);
        console.log('✓ User setup:', setupResult);

        // Test other features silently
        await Promise.all([
            adoption.updateInteraction(user.uid, 'test_interaction'),
            adoption.getRecommendations(user.uid),
            achievements.checkAchievements(user.uid),
            adoption.trackAnalytics(user.uid, 'test_event')
        ]);

        console.log('✅ All features verified successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Only run verification if explicitly called
// This won't interfere with normal website operation
window.runVerification = verifyAllFeatures;
