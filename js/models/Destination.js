// Base class for all destinations
class Destination {
    constructor(firebaseData) {
        // Base properties from Firebase
        this.id = firebaseData.id || '';
        this.name = firebaseData.name || '';
        this.description = firebaseData.description || '';
        this.location = firebaseData.location || '';
        this.imageUrl = firebaseData.imageUrl || '';
        this.category = firebaseData.category || '';
    }

    // Method to convert to Firebase format
    toFirebaseObject() {
        return {
            name: this.name,
            description: this.description,
            location: this.location,
            imageUrl: this.imageUrl,
            category: this.category
        };
    }
}

export default Destination;
