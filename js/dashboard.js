class UserDashboard {
    constructor() {
        this.metrics = new EngagementMetrics();
        this.achievements = new Achievements();
    }

    async updateDashboard(userId) {
        const stats = await this.metrics.getEngagementStats(userId);
        const userPrefs = await this.getUserPreferences(userId);
        
        this.displayStats(stats);
        this.displayPreferences(userPrefs);
        await this.checkNewAchievements(userId);
    }

    async getUserPreferences(userId) {
        const userDoc = await firebase.firestore()
            .collection('users')
            .doc(userId)
            .get();
        return userDoc.data().preferences || [];
    }

    displayStats(stats) {
        const dashboardEl = document.getElementById('user-dashboard');
        if (dashboardEl) {
            dashboardEl.innerHTML = `
                <div class="dashboard-stats">
                    <h3>Your Activity</h3>
                    <p>Total Actions: ${stats.totalActions}</p>
                    <div class="activity-breakdown">
                        ${this.formatActivityBreakdown(stats.actionTypes)}
                    </div>
                </div>
            `;
        }
    }

    formatActivityBreakdown(actionTypes) {
        return Object.entries(actionTypes)
            .map(([action, count]) => `
                <div class="activity-item">
                    <span class="activity-label">${this.formatActionLabel(action)}</span>
                    <span class="activity-count">${count}</span>
                </div>
            `).join('');
    }

    formatActionLabel(action) {
        return action.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async checkNewAchievements(userId) {
        const newAchievements = await this.achievements.checkAchievements(userId);
        newAchievements.forEach(achievement => {
            notifications.showAchievement(achievement);
        });
    }
}
