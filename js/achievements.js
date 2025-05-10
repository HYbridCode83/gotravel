class Achievements {
    constructor() {
        this.db = firebase.firestore();
    }

    async checkAchievements(userId) {
        const user = await this.db.collection('users').doc(userId).get();
        const data = user.data();
        const achievements = [];

        // Check for achievements
        if (data.interactionCount >= 5) {
            achievements.push('explorer');
        }
        if (data.preferences && data.preferences.length >= 3) {
            achievements.push('preference_master');
        }

        // Update user achievements and show notifications
        if (achievements.length > 0) {
            await this.db.collection('users').doc(userId).update({
                achievements: firebase.firestore.FieldValue.arrayUnion(...achievements)
            });
            
            // Show notification for each new achievement
            achievements.forEach(achievement => {
                NotificationSystem.showAchievement(achievement);
            });
        }

        return achievements;
    }
}

// Initialize achievements system
const achievements = new Achievements();
