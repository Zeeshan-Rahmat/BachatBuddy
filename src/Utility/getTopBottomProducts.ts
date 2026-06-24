import { ProductType } from "../types/appTypes";

interface GetTopBottomProductsParams {
    products: ProductType[];
    type: 'top' | 'bottom';
    limit: 5 | 10;
}

/**
 * Filters and ranks products by sales volume performance.
 * * - 'top': Ranks from most sold to least sold.
 * - 'bottom': Ranks from least sold to most sold.
 */
export const getTopBottomProducts = ({
    products,
    type,
    limit,
}: GetTopBottomProductsParams): ProductType[] => {
    // Edge case safety handler
    if (!products || products.length === 0) return [];

    // Create a shallow copy array slice to avoid mutating your core original state data
    const sortedProducts = [...products];

    if (type === 'top') {
        // High to Low: Most sold stock items come first
        sortedProducts.sort((a, b) => b.sold_stock - a.sold_stock);
    } else {
        // Low to High: Least sold stock items come first
        sortedProducts.sort((a, b) => a.sold_stock - b.sold_stock);
    }

    // Extract exactly the requested volume count slice
    return sortedProducts.slice(0, limit);
};