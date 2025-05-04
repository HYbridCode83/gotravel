import Destination from './Destination';

class NatureDestination extends Destination {
    constructor(firebaseData) {
        super(firebaseData);
        this.activities = firebaseData.activities || [];
        this.bestSeason = firebaseData.bestSeason || '';
        this.flora = firebaseData.flora || [];
        this.fauna = firebaseData.fauna || [];
    }

    toFirebaseObject() {
        return {
            ...super.toFirebaseObject(),
            activities: this.activities,
            bestSeason: this.bestSeason,
            flora: this.flora,
            fauna: this.fauna
        };
    }

    addActivity(activity) {
        this.activities.push(activity);
    }

    addSpecies(type, name) {
        if (type === 'flora') this.flora.push(name);
        if (type === 'fauna') this.fauna.push(name);
    }
}

export default NatureDestination;
