import { ProductType } from "../types/appTypes";

// Represents the shape expected by react-native-gifted-charts BarChart element
interface GiftedBarChartData {
    value: number;
    label: string;
    frontColor?: string; // Optional custom color per bar item node
}

interface ConvertToBarChartParams {
    products: ProductType[];
    metric: 'sold_stock' | 'quantity' | 'added_stock';
    barColor?: string; // Global fall-through bar theme accent color
}

/**
 * Transforms an array of ProductType data into the explicit configuration shape
 * required to render standard React Native Gifted Bar Charts.
 */
export const convertProductsToBarChartData = ({
    products,
    metric,
    barColor = '#10b981', // Default emerald green
}: ConvertToBarChartParams): GiftedBarChartData[] => {
    if (!products || products.length === 0) return [];

    return products.map((product, index) => {
        // Truncate long product names so they don't crash into each other on the X-Axis
        const truncatedLabel = index + 1;

        return {
            value: product[metric] || 0,
            label: truncatedLabel.toString(),
            frontColor: barColor,
        };
    });
};