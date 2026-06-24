import { CustomerType, SupplierType } from "../types/appTypes";

interface GetTopBottomPartiesParams<T extends CustomerType | SupplierType> {
    parties: T[];
    type: 'top' | 'bottom';
    limit: 5 | 10;
    metric: keyof T & ("total_purchases" | "total_supply_value" | string);
}

/**
 * Filters and ranks parties (Customers or Suppliers) dynamically by financial performance metrics.
 * - 'top': Ranks from highest metric value to lowest.
 * - 'bottom': Ranks from lowest metric value to highest.
 */
export const getTopBottomParties = <T extends CustomerType | SupplierType>({
    parties,
    type,
    limit,
    metric,
}: GetTopBottomPartiesParams<T>): T[] => {
    // 1. Edge case safety handler
    if (!parties || parties.length === 0) return [];

    // 2. Create a shallow copy array slice to avoid mutating core original data
    const sortedParties = [...parties];

    // 3. Dynamic Sort Logic evaluating the passed 'metric' key parameter
    sortedParties.sort((a, b) => {
        // Safe typecast lookup strategy for structural property key evaluation
        const valueA = (a[metric] as number) || 0;
        const valueB = (b[metric] as number) || 0;

        if (type === 'top') {
            return valueB - valueA; // High to Low (Descending)
        } else {
            return valueA - valueB; // Low to High (Ascending)
        }
    });

    // 4. Extract exactly the requested volume count slice
    return sortedParties.slice(0, limit);
};