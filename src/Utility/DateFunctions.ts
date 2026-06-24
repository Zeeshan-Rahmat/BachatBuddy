export function getRelativeTimeShort(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid date';

    const now = new Date();

    // Calculate the difference in days absolute to midnight milestones
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const itemDateStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const diffInTime = itemDateStart.getTime() - todayStart.getTime();
    const diffInDays = Math.round(diffInTime / (1000 * 60 * 60 * 24));

    // 1. Handle explicit words first
    if (diffInDays === 0) return 'Today';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays === 1) return 'Tomorrow';

    // 2. For numbers further out, generate the short format (e.g., "2d ago" or "7d ago")
    if (diffInDays < 0) {
        return `${Math.abs(diffInDays)}d ago`;
    } else {
        return `In ${diffInDays}d`;
    }
}

export function formatDateTime(date: Date | string): string {
    // Convert to Date instance safely if a string is passed in
    const dateObj = date instanceof Date ? date : new Date(date);

    // Safety check for malformed dates
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    // 1. Format the date part (e.g., "Jun 18, 2026" or "18 Jun 2026" depending on device locale)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // 2. Format the time part with AM/PM indicators (e.g., "3:40 PM")
    const formattedTime = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Combine them into your desired layout
    return `${formattedDate}, ${formattedTime}`;
}
