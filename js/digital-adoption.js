class MinimalDigitalAdoption {
    constructor() {
        this.db = firebase.firestore();
    }

    async setupUser(user) {
        try {
            await this.db.collection('users').doc(user.uid).set({
                email: user.email,
                preferences: [],
                interactionCount: 0
            }, { merge: true }); // Using merge to not overwrite existing data
            return true;
        } catch (error) {
            console.error('Setup error:', error);
            return false;
        }
    }

    async updateInteraction(userId, type) {
        try {
            await this.db.collection('users').doc(userId).update({
                interactionCount: firebase.firestore.FieldValue.increment(1),
                lastAction: type
            });
        } catch (error) {
            console.error('Track error:', error);
        }
    }
}

// Initialize the adoption system
const adoption = new MinimalDigitalAdoption();
const userInterests = new Set();

// Add these test functions at the bottom of digital-adoption.js
function testDigitalAdoption() {
    console.log('Testing Digital Adoption Features...');
    
    // Test user interests functionality
    document.querySelectorAll('.interest-buttons button').forEach(button => {
        button.style.border = '2px solid #ddd';
    });
    
    // Test tracking
    const placeCards = document.querySelectorAll('.place-card');
    if (placeCards.length > 0) {
        console.log('✓ Place cards found and ready for tracking');
    } else {
        console.log('✗ Place cards not found - check your HTML');
    }
    
    // Test search tracking
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        console.log('✓ Search bar found and ready for tracking');
    } else {
        console.log('✗ Search bar not found - check your HTML');
    }
}

// Call this when page loads
document.addEventListener('DOMContentLoaded', testDigitalAdoption);
