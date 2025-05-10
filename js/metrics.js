class EngagementMetrics {
    constructor() {
        this.db = firebase.firestore();
    }

    async trackEngagement(userId, action, metadata = {}) {
        try {
            await this.db.collection('metrics').add({
                userId,
                action,
                metadata,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Use server timestamp for accuracy
                sessionId: this.getCurrentSessionId(), // Track session
                platform: this.getPlatformInfo() // Track user platform
            });
        } catch (error) {
            console.error('Error tracking engagement:', error);
        }
    }

    getCurrentSessionId() {
        if (!sessionStorage.getItem('session_id')) {
            sessionStorage.setItem('session_id', Date.now().toString());
        }
        return sessionStorage.getItem('session_id');
    }

    getPlatformInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        };
    }

    async getEngagementStats(userId) {
        const metrics = await this.db.collection('metrics')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();

        const stats = {
            totalActions: metrics.size,
            actionTypes: this.countActionTypes(metrics.docs),
            lastAction: metrics.docs[0]?.data()?.timestamp || null,
            sessionCount: this.countUniqueSessions(metrics.docs)
        };

        return stats;
    }

    countActionTypes(docs) {
        return docs.reduce((acc, doc) => {
            const action = doc.data().action;
            acc[action] = (acc[action] || 0) + 1;
            return acc;
        }, {});
    }

    countUniqueSessions(docs) {
        const sessions = new Set(
            docs.map(doc => doc.data().sessionId)
        );
        return sessions.size;
    }
}

// Initialize metrics
const metrics = new EngagementMetrics();
