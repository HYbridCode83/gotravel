class NotificationSystem {
    constructor() {
        this.container = this.createNotificationContainer();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        `;
        document.body.appendChild(container);
        return container;
    }

    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <h4>Achievement Unlocked!</h4>
                <p>${this.getAchievementText(achievement)}</p>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    getAchievementText(achievement) {
        const achievements = {
            'explorer': 'Explorer: Visited 5 different destinations!',
            'preference_master': 'Preference Master: Set up your travel preferences!'
        };
        return achievements[achievement] || 'New achievement unlocked!';
    }
}

// Initialize notification system
const notifications = new NotificationSystem();
