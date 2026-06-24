import { SupplierType } from "../types/appTypes";

interface GiftedBarChartData {
    value: number;
    label: string;
    frontColor: string;
}

interface ConvertSuppliersToBarParams {
    suppliers: SupplierType[];
    barColor?: string; // Color for the single bar
}

/**
 * Transforms SupplierType records into a standard flat array for a Single Bar Chart.
 * Each supplier gets exactly one bar matching the chosen performance metric.
 */
export const convertSuppliersToBarChartData = ({
    suppliers,
    barColor = '#0EA5E9', // Default theme accent
}: ConvertSuppliersToBarParams): GiftedBarChartData[] => {
    if (!suppliers || suppliers.length === 0) return [];

    return suppliers.map((supplier, index) => {
        // Truncate name if it's too long for the X-axis baseline space
        const formattedLabel = index + 1;

        return {
            value: (supplier.total_supply_value as number) || 0,
            label: formattedLabel.toString(),
            frontColor: barColor,
        };
    });
};