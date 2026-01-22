interface UserProgress {
    xp: number;
    level: number;
    badges: string[];
    interactions: {
        type: string;
        timestamp: number;
        metadata?: any;
    }[];
}

export function getUserProgress(): UserProgress {
    if (typeof window === 'undefined') {
        return { xp: 0, level: 1, badges: [], interactions: [] };
    }

    const stored = localStorage.getItem('user_progress');
    if (!stored) {
        const defaultProgress: UserProgress = {
            xp: 0,
            level: 1,
            badges: [],
            interactions: []
        };
        localStorage.setItem('user_progress', JSON.stringify(defaultProgress));
        return defaultProgress;
    }
    return JSON.parse(stored);
}

export function addXP(amount: number, type: string, metadata?: any): UserProgress {
    if (typeof window === 'undefined') return getUserProgress();

    const progress = getUserProgress();
    progress.xp += amount;
    progress.level = Math.floor(progress.xp / 500) + 1;
    progress.interactions.push({
        type,
        timestamp: Date.now(),
        metadata
    });

    // Check for badge unlocks
    checkBadges(progress);

    localStorage.setItem('user_progress', JSON.stringify(progress));
    return progress;
}

function checkBadges(progress: UserProgress) {
    const interactions = progress.interactions;

    // Explorer badge: Viewed 10 celestial objects
    const viewedObjects = interactions.filter(i => i.type === 'view_planet').length;
    if (viewedObjects >= 10 && !progress.badges.includes('explorer')) {
        progress.badges.push('explorer');
        // In a real app, we would show a toast here
        console.log('Badge Unlocked: Explorer');
    }

    // Astronomer badge: Read 20 APOD entries
    const apodViews = interactions.filter(i => i.type === 'view_apod').length;
    if (apodViews >= 20 && !progress.badges.includes('astronomer')) {
        progress.badges.push('astronomer');
        console.log('Badge Unlocked: Astronomer');
    }

    // Scholar badge: Completed 5 quizzes with 100% score
    const perfectQuizzes = interactions.filter(i =>
        i.type === 'quiz_completed' && i.metadata?.score === 100
    ).length;
    if (perfectQuizzes >= 5 && !progress.badges.includes('scholar')) {
        progress.badges.push('scholar');
        console.log('Badge Unlocked: Scholar');
    }
}
