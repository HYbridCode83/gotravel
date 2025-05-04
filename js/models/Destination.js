// Base class for all destinations
class Destination {
    constructor(firebaseData) {
        this.id = firebaseData.id || '';
        this.name = firebaseData.name || '';
        this.description = firebaseData.description || '';
        this.location = firebaseData.location || '';
        this.imageUrl = firebaseData.imageUrl || '';
        this.category = firebaseData.category || '';
        this.attractions = firebaseData.attractions || [];
        this.budget = firebaseData.budget || '';
        this.duration = firebaseData.duration || '';
        this.bestTimeToVisit = firebaseData.bestTimeToVisit || '';
    }

    // Method to convert to Firebase format
    toFirebaseObject() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            location: this.location,
            imageUrl: this.imageUrl,
            category: this.category,
            attractions: this.attractions,
            budget: this.budget,
            duration: this.duration,
            bestTimeToVisit: this.bestTimeToVisit
        };
    }
}

export default Destination;
