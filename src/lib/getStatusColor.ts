const successColors: { bg: string; text: string } = { bg: 'bg-success/10', text: 'text-success' }
const warningColors: { bg: string; text: string } = { bg: 'bg-warning/10', text: 'text-warning' }
const dangerColors: { bg: string; text: string } = { bg: 'bg-danger/10', text: 'text-danger' }

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'In Stock': successColors,
    'Low Stock': warningColors,
    'Out of Stock': dangerColors,
    'Paid': successColors,
    'Pending': warningColors,
    'Unpaid': dangerColors,
};

export function getStatusColor(status: string) {
    return STATUS_COLORS[status] ?? STATUS_COLORS['In Stock'];
}