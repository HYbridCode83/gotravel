import Destination from './Destination.js';

class NatureDestination extends Destination {
    constructor(firebaseData) {
        super(firebaseData);
        this.bestSeason = firebaseData.bestSeason || '';
        this.activities = firebaseData.activities || [];
        this.flora = firebaseData.flora || [];
        this.fauna = firebaseData.fauna || [];
    }

    toFirebaseObject() {
        return {
            ...super.toFirebaseObject(),
            bestSeason: this.bestSeason,
            activities: this.activities,
            flora: this.flora,
            fauna: this.fauna
        };
    }

    addActivity(activity) {
        this.activities.push(activity);
    }

    addFlora(plant) {
        this.flora.push(plant);
    }

    addFauna(animal) {
        this.fauna.push(animal);
    }
}

export default NatureDestination;
