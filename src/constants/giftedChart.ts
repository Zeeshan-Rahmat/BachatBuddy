// ============================================================================
// 1. MONTHLY SALES OVERVIEW (Single Line Chart)

import { COLORS } from "./theme";

// ============================================================================
export const monthlySalesData = [
    { value: 45000, label: 'Jan' },
    { value: 52000, label: 'Feb' },
    { value: 61000, label: 'Mar' },
    { value: 58000, label: 'Apr' },
    { value: 76000, label: 'May' },
    { value: 82000, label: 'Jun' }
];

// ============================================================================
// 2. REVENUE VS PROFIT (Double Line Chart)
// ============================================================================
// For multi-line, gifted-charts uses a base dataset and a secondary 'data2' config array
export const revenueData = [
    { value: 45000, label: 'Jan' },
    { value: 52000, label: 'Feb' },
    { value: 61000, label: 'Mar' },
    { value: 58000, label: 'Apr' },
    { value: 76000, label: 'May' },
    { value: 82000, label: 'Jun' }
];

export const profitData = [
    { value: 12000 },
    { value: 15000 },
    { value: 18000 },
    { value: 16000 },
    { value: 25000 },
    { value: 29000 }
];

// ============================================================================
// 3. PENDING VS PAID DUES (Pie Chart)
// ============================================================================
export const duesPieData = [
    { value: 145000, label: 'Paid', color: COLORS.success, text: 'Paid' },
    { value: 42000, label: 'Pending', color: COLORS.warning, text: 'Pending' },
    { value: 18000, label: 'Unpaid', color: COLORS.danger, text: 'Unpaid' }
];

// ============================================================================
// 4. FAST AND SLOW MOVING PRODUCTS (Bar Chart)
// ============================================================================
export const fastSlowMovingProductsData = [
    { value: 145, label: 'USB-C', frontColor: '#4F46E5' },
    { value: 120, label: 'Watch 5', frontColor: '#4F46E5' },
    { value: 88, label: 'Mouse', frontColor: '#4F46E5' },
    { value: 76, label: 'Speaker', frontColor: '#4F46E5' },
    { value: 64, label: 'Keyboard', frontColor: '#4F46E5' },
    { value: 14, label: 'Stand', frontColor: '#EF4444' },
    { value: 11, label: 'Webcam', frontColor: '#EF4444' },
    { value: 9, label: 'Adapter', frontColor: '#EF4444' },
    { value: 7, label: 'Splitter', frontColor: '#EF4444' },
    { value: 5, label: 'Pad', frontColor: '#EF4444' }
];

// ============================================================================
// 5. PRODUCT SALES BY CATEGORY (Grouped / Stacked Bar Chart)
// ============================================================================
// For Grouped Bar charts, pass a flat array alternating columns with spacing offsets
export const productCategoryBarData = [
    { value: 145, label: '1', frontColor: COLORS.primaryGreen },
    { value: 120, label: '2', frontColor: COLORS.primaryGreen },
    { value: 88, label: '3', frontColor: COLORS.primaryGreen },
    { value: 76, label: '4', frontColor: COLORS.primaryGreen },
    { value: 64, label: '5', frontColor: COLORS.primaryGreen },
];

// ============================================================================
// 6. STOCK OVERVIEW (Double Line Chart)
// ============================================================================
export const addedStockData = [
    { value: 120, label: 'Jan' },
    { value: 150, label: 'Feb' },
    { value: 180, label: 'Mar' },
    { value: 160, label: 'Apr' },
    { value: 210, label: 'May' },
    { value: 240, label: 'Jun' }
];

export const soldStockData = [
    { value: 90 },
    { value: 110 },
    { value: 140 },
    { value: 130 },
    { value: 185 },
    { value: 220 }
];

// ============================================================================
// 7. STOCK STATUS (Pie / Donut Chart)
// ============================================================================
// Same configuration as a Pie Chart, simply pass donut={true} into the component props
export const stockStatusDonutData = [
    { value: 58, label: 'In Stock', color: '#10B981', text: 'In Stock' },
    { value: 12, label: 'Low Stock', color: '#F59E0B', text: 'Low Stock' },
    { value: 5, label: 'Out of Stock', color: '#EF4444', text: 'Out of Stock' }
];

// ============================================================================
// 8. CUSTOMER PURCHASES VS PENDING DUES (Grouped Bar Chart)
// ============================================================================
export const customerGroupedBarData = [
    { value: 72000, label: 'Cust 1', frontColor: '#0EA5E9' },
    { value: 9000, frontColor: '#F59E0B', spacing: 25 },

    { value: 68000, label: 'Cust 2', frontColor: '#0EA5E9' },
    { value: 12000, frontColor: '#F59E0B', spacing: 25 },

    { value: 42000, label: 'Cust 3', frontColor: '#0EA5E9' },
    { value: 5000, frontColor: '#F59E0B', spacing: 25 },

    { value: 39000, label: 'Cust 4', frontColor: '#0EA5E9' },
    { value: 0, frontColor: '#F59E0B', spacing: 25 },

    { value: 25000, label: 'Cust 5', frontColor: '#0EA5E9' },
    { value: 3500, frontColor: '#F59E0B', spacing: 25 }
];

// ============================================================================
// 9. NEW CUSTOMERS ADDED (Single Line Chart)
// ============================================================================
export const newCustomersData = [
    { value: 12, label: 'Jan' },
    { value: 18, label: 'Feb' },
    { value: 28, label: 'Mar' },
    { value: 21, label: 'Apr' },
    { value: 30, label: 'May' },
    { value: 45, label: 'Jun' }
];