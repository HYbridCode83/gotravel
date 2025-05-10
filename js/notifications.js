class NotificationSystem {
    static showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <p>${this.getAchievementText(achievement)}</p>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => notification.remove(), 3000);
    }

    static getAchievementText(achievement) {
        const achievements = {
            'explorer': 'Achievement: Explored 5 destinations!',
            'preference_master': 'Achievement: Travel preferences set!'
        };
        return achievements[achievement] || 'New achievement unlocked!';
    }
}
