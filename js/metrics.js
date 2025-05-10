// Create a new file for metrics tracking
class EngagementMetrics {
    constructor() {
        this.db = firebase.firestore();
    }

    async trackEngagement(userId, action) {
        await this.db.collection('metrics').add({
            userId,
            action,
            timestamp: new Date().toISOString()
        });
    }

    async getEngagementStats(userId) {
        const metrics = await this.db.collection('metrics')
            .where('userId', '==', userId)
            .get();

        return {
            totalActions: metrics.size,
            actionTypes: this.countActionTypes(metrics.docs)
        };
    }

    countActionTypes(docs) {
        return docs.reduce((acc, doc) => {
            const action = doc.data().action;
            acc[action] = (acc[action] || 0) + 1;
            return acc;
        }, {});
    }
}
