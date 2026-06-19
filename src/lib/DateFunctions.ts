export function getRelativeTime(date: Date | string): string {
    // Correct way to check if the value is NOT a Date instance
    const dateObj = date instanceof Date ? date : new Date(date);

    // Fallback case: Handle invalid date strings gracefully so your app doesn't crash
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();

    // Calculate the difference in milliseconds
    const diffInTime = dateObj.getTime() - now.getTime();

    // Convert to days and round to the nearest whole integer
    const diffInDays = Math.round(diffInTime / (1000 * 60 * 60 * 24));

    return rtf.format(diffInDays, 'day');
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
