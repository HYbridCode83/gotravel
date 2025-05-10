class Achievements {
    constructor() {
        this.db = firebase.firestore();
    }

    async checkAchievements(userId) {
        try {
            const [user, progress] = await Promise.all([
                this.db.collection('users').doc(userId).get(),
                this.getProgress(userId)
            ]);
            
            const data = user.data();
            const achievements = [];

            // Check for achievements based on interaction count
            if (data.interactionCount >= 5 && !progress.achievements.includes('explorer')) {
                achievements.push('explorer');
            }
            if (data.preferences?.length >= 3 && !progress.achievements.includes('preference_master')) {
                achievements.push('preference_master');
            }
            // New achievement for session count
            if (progress.sessionCount >= 3 && !progress.achievements.includes('regular_visitor')) {
                achievements.push('regular_visitor');
            }

            // Update user achievements
            if (achievements.length > 0) {
                await this.updateAchievements(userId, achievements);
                NotificationSystem.showAchievement(achievements);
            }

            return achievements;
        } catch (error) {
            console.error('Error checking achievements:', error);
            return [];
        }
    }

    async getProgress(userId) {
        const progressDoc = await this.db.collection('userProgress').doc(userId).get();
        if (!progressDoc.exists) {
            await this.initializeProgress(userId);
            return { achievements: [], sessionCount: 0 };
        }
        return progressDoc.data();
    }

    async initializeProgress(userId) {
        await this.db.collection('userProgress').doc(userId).set({
            achievements: [],
            sessionCount: 0,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async updateAchievements(userId, newAchievements) {
        await this.db.collection('userProgress').doc(userId).update({
            achievements: firebase.firestore.FieldValue.arrayUnion(...newAchievements),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// Initialize achievements system
const achievements = new Achievements();
