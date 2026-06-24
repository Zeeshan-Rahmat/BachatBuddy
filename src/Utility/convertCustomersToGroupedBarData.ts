import { CustomerType } from "../types/appTypes";

interface GiftedGroupedBarData {
    value: number;
    label?: string;
    frontColor: string;
    spacing?: number;
}

interface ConvertCustomersToGroupedBarParams {
    customers: CustomerType[];
    spendingColor?: string; // Color for Total Purchases
    duesColor?: string;     // Color for Pending Dues
    groupSpacing?: number;  // Space between pairs of bars
}

/**
 * Transforms CustomerType records into a flat-mapped grouped bar array.
 * Maps:
 * - Bar 1: Total Purchases (with customer name label)
 * - Bar 2: Pending Dues (with an right-offset group gap spacing)
 */
export const convertCustomersToGroupedBarData = ({
    customers,
    spendingColor = '#0EA5E9',
    duesColor = '#F59E0B',
    groupSpacing = 25,
}: ConvertCustomersToGroupedBarParams): GiftedGroupedBarData[] => {
    if (!customers || customers.length === 0) return [];

    // .flatMap takes each customer object and outputs a flat list of alternating pairs
    return customers.flatMap((customer) => {
        // Truncate name if it's too long for the X-axis label
        const formattedLabel =
            customer.name.length > 8
                ? `${customer.name.substring(0, 6)}...`
                : customer.name;

        return [
            // First Bar: Total Spending / Purchases
            {
                value: customer.total_purchases || 0,
                label: formattedLabel,
                frontColor: spendingColor,
            },
            // Second Bar: Outstanding / Pending Dues
            {
                value: customer.pending_dues || 0,
                frontColor: duesColor,
                spacing: groupSpacing, // Pushes the NEXT customer pair away
            },
        ];
    });
};