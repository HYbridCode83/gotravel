import HistoricalDestination from './HistoricalDestination';
import NatureDestination from './NatureDestination';
import CulturalDestination from './CulturalDestination';
import Destination from './Destination';

class DestinationFactory {
    static createDestination(firebaseData) {
        switch(firebaseData.category?.toLowerCase()) {
            case 'historical':
                return new HistoricalDestination(firebaseData);
            case 'nature':
                return new NatureDestination(firebaseData);
            case 'cultural':
                return new CulturalDestination(firebaseData);
            default:
                return new Destination(firebaseData);
        }
    }
}

export default DestinationFactory;
