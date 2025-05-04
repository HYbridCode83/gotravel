import Destination from './Destination.js';

class CulturalDestination extends Destination {
    constructor(firebaseData) {
        super(firebaseData);
        this.culture = firebaseData.culture || '';
        this.traditions = firebaseData.traditions || [];
        this.events = firebaseData.events || [];
    }

    toFirebaseObject() {
        return {
            ...super.toFirebaseObject(),
            culture: this.culture,
            traditions: this.traditions,
            events: this.events
        };
    }

    addEvent(event) {
        this.events.push(event);
    }

    addTradition(tradition) {
        this.traditions.push(tradition);
    }
}

export default CulturalDestination;
