import Destination from './Destination.js';
import CulturalDestination from './CulturalDestination.js';
import HistoricalDestination from './HistoricalDestination.js';
import NatureDestination from './NatureDestination.js';

class DestinationFactory {
    static createDestination(firebaseData) {
        const category = firebaseData.category?.toLowerCase() || '';
        
        switch(category) {
            case 'cultural':
                return new CulturalDestination(firebaseData);
            case 'historical':
                return new HistoricalDestination(firebaseData);
            case 'nature':
                return new NatureDestination(firebaseData);
            default:
                return new Destination(firebaseData);
        }
    }
}

export default DestinationFactory;
