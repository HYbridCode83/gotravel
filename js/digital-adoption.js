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
            });
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
