import Destination from './Destination';

class HistoricalDestination extends Destination {
    constructor(firebaseData) {
        super(firebaseData);
        this.yearBuilt = firebaseData.yearBuilt || '';
        this.historicalSignificance = firebaseData.historicalSignificance || '';
    }

    toFirebaseObject() {
        return {
            ...super.toFirebaseObject(),
            yearBuilt: this.yearBuilt,
            historicalSignificance: this.historicalSignificance
        };
    }
}

export default HistoricalDestination;
