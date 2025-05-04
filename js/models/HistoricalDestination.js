import Destination from './Destination.js';

class HistoricalDestination extends Destination {
    constructor(firebaseData) {
        super(firebaseData);
        this.yearBuilt = firebaseData.yearBuilt || '';
        this.historicalSignificance = firebaseData.historicalSignificance || '';
        this.historicalEvents = firebaseData.historicalEvents || [];
    }

    toFirebaseObject() {
        return {
            ...super.toFirebaseObject(),
            yearBuilt: this.yearBuilt,
            historicalSignificance: this.historicalSignificance,
            historicalEvents: this.historicalEvents
        };
    }

    addHistoricalEvent(event) {
        this.historicalEvents.push(event);
    }
}

export default HistoricalDestination;
