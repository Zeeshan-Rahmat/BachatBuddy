import { ne } from 'drizzle-orm';
import { COLORS } from '@/src/constants/theme';
import { mapProductRowToAppProduct } from '@/src/services/inventory/productUiMapper';
import { mapCustomerRowToPartyCustomer, mapSupplierRowToPartySupplier } from '@/src/services/parties/partyUiMapper';
import type {
    CustomerType,
    LegendPieChartType,
    ProductRankingType,
    ProductType,
    SupplierType,
    TimePeriodType,
} from '@/src/types/appTypes';
import { convertCustomersToGroupedBarData } from '@/src/Utility/convertCustomersToGroupedBarData';
import { convertProductsToBarChartData } from '@/src/Utility/convertProductsToBarChartData';
import { convertSuppliersToBarChartData } from '@/src/Utility/convertSuppliersToBarChartData';
import { getTopBottomParties } from '@/src/Utility/getTopBottomParties';
import { getTopBottomProducts } from '@/src/Utility/getTopBottomProducts';
import { db } from '../client';
import { customers, invoiceItems, invoices, products, suppliers } from '../schema';

export type ReportChartDataPoint = {
    value: number;
    label?: string;
};

export type ReportBarDataPoint = ReportChartDataPoint & {
    frontColor?: string;
    spacing?: number;
};

export type ReportPieDataPoint = {
    value: number;
    color: string;
    text?: string;
};

export type StockReportData = {
    addedStockData: ReportChartDataPoint[];
    soldStockData: ReportChartDataPoint[];
    stockStatusPieData: ReportPieDataPoint[];
    stockStatusLabels: LegendPieChartType[];
    rankedProducts: ProductType[];
    productsChartData: ReportBarDataPoint[];
};

export type SalesReportData = {
    salesOverviewData: ReportChartDataPoint[];
    paymentStatusPieData: ReportPieDataPoint[];
    paymentStatusLabels: LegendPieChartType[];
    revenueData: ReportChartDataPoint[];
    profitData: ReportChartDataPoint[];
};

export type PartyReportData = {
    customerGrowthData: ReportChartDataPoint[];
    rankedCustomers: CustomerType[];
    customersChartData: ReportBarDataPoint[];
    rankedSuppliers: SupplierType[];
    suppliersChartData: ReportBarDataPoint[];
};

const rankToParams = (rank: ProductRankingType): { type: 'top' | 'bottom'; limit: 5 | 10 } => ({
    type: rank.startsWith('Top') ? 'top' : 'bottom',
    limit: rank.endsWith('5') ? 5 : 10,
});

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number): Date => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const addMonths = (date: Date, months: number): Date => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
};

const getBuckets = (period: TimePeriodType) => {
    const now = new Date();

    if (period === 'Daily') {
        const today = startOfDay(now);
        return Array.from({ length: 7 }, (_, index) => {
            const start = addDays(today, index - 6);
            const end = addDays(start, 1);

            return {
                key: start.toISOString().slice(0, 10),
                label: start.toLocaleDateString('en-US', { weekday: 'short' }),
                start: start.getTime(),
                end: end.getTime(),
            };
        });
    }

    if (period === 'Weekly') {
        const today = startOfDay(now);
        const weekStart = addDays(today, -today.getDay());

        return Array.from({ length: 6 }, (_, index) => {
            const start = addDays(weekStart, (index - 5) * 7);
            const end = addDays(start, 7);

            return {
                key: start.toISOString().slice(0, 10),
                label: `W${index + 1}`,
                start: start.getTime(),
                end: end.getTime(),
            };
        });
    }

    if (period === 'Yearly') {
        const year = now.getFullYear();

        return Array.from({ length: 5 }, (_, index) => {
            const bucketYear = year + index - 4;
            const start = new Date(bucketYear, 0, 1);
            const end = new Date(bucketYear + 1, 0, 1);

            return {
                key: String(bucketYear),
                label: String(bucketYear),
                start: start.getTime(),
                end: end.getTime(),
            };
        });
    }

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return Array.from({ length: 6 }, (_, index) => {
        const start = addMonths(monthStart, index - 5);
        const end = addMonths(start, 1);

        return {
            key: `${start.getFullYear()}-${start.getMonth()}`,
            label: start.toLocaleDateString('en-US', { month: 'short' }),
            start: start.getTime(),
            end: end.getTime(),
        };
    });
};

const bucketRows = <T>(
    rows: T[],
    period: TimePeriodType,
    getTimestamp: (row: T) => number | null | undefined,
    getValue: (row: T) => number,
): ReportChartDataPoint[] => {
    return getBuckets(period).map((bucket) => {
        const value = rows.reduce((total, row) => {
            const timestamp = getTimestamp(row);

            if (!timestamp || timestamp < bucket.start || timestamp >= bucket.end) {
                return total;
            }

            return total + getValue(row);
        }, 0);

        return {
            value,
            label: bucket.label,
        };
    });
};

const formatCurrency = (value: number): string => `PKR ${Math.round(value).toLocaleString()}`;

const withPieFallback = (data: ReportPieDataPoint[]): ReportPieDataPoint[] => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total > 0) {
        return data;
    }

    return [{ value: 1, color: COLORS.light200, text: 'No Data' }];
};

export const getStockReportData = async (
    period: TimePeriodType,
    productRank: ProductRankingType,
): Promise<StockReportData> => {
    const productRows = await db.query.products.findMany({
        where: ne(products.syncStatus, 'pending_delete'),
        with: {
            supplier: true,
            createdBy: true,
            lastUpdatedBy: true,
        },
    });
    const invoiceItemRows = await db.query.invoiceItems.findMany({
        where: ne(invoiceItems.syncStatus, 'pending_delete'),
        with: {
            invoice: true,
        },
    });

    const mappedProducts = productRows.map(mapProductRowToAppProduct);
    const rankParams = rankToParams(productRank);
    const rankedProducts = getTopBottomProducts({
        products: mappedProducts,
        type: rankParams.type,
        limit: rankParams.limit,
    });

    const inStockCount = productRows.filter((product) => product.status === 'In Stock').length;
    const lowStockCount = productRows.filter((product) => product.status === 'Low Stock').length;
    const outOfStockCount = productRows.filter((product) => product.status === 'Out of Stock').length;

    const stockStatusPieData: ReportPieDataPoint[] = [
        { value: inStockCount, color: COLORS.success, text: 'In Stock' },
        { value: lowStockCount, color: COLORS.warning, text: 'Low Stock' },
        { value: outOfStockCount, color: COLORS.danger, text: 'Out of Stock' },
    ];

    return {
        addedStockData: bucketRows(productRows, period, (product) => product.createdAt, (product) => product.addedStock),
        soldStockData: bucketRows(
            invoiceItemRows.filter((item) => item.invoice?.syncStatus !== 'pending_delete'),
            period,
            (item) => item.invoice?.createdAt,
            (item) => item.quantity,
        ),
        stockStatusPieData: withPieFallback(stockStatusPieData),
        stockStatusLabels: [
            { color: 'bg-success', label: 'In Stock', value: String(inStockCount) },
            { color: 'bg-warning', label: 'Low Stock', value: String(lowStockCount) },
            { color: 'bg-danger', label: 'Out of Stock', value: String(outOfStockCount) },
        ],
        rankedProducts,
        productsChartData: convertProductsToBarChartData({
            products: rankedProducts,
            metric: 'sold_stock',
            barColor: COLORS.primaryGreen,
        }),
    };
};

export const getSalesReportData = async (
    salesPeriod: TimePeriodType,
    revenueProfitPeriod: TimePeriodType,
): Promise<SalesReportData> => {
    const invoiceRows = await db.query.invoices.findMany({
        where: ne(invoices.syncStatus, 'pending_delete'),
    });
    const invoiceItemRows = await db.query.invoiceItems.findMany({
        where: ne(invoiceItems.syncStatus, 'pending_delete'),
        with: {
            invoice: true,
        },
    });

    const paidAmount = invoiceRows.reduce((total, invoice) => total + invoice.paidAmount, 0);
    const pendingAmount = invoiceRows
        .filter((invoice) => invoice.status === 'Pending')
        .reduce((total, invoice) => total + invoice.remainingAmount, 0);
    const unpaidAmount = invoiceRows
        .filter((invoice) => invoice.status === 'Unpaid')
        .reduce((total, invoice) => total + invoice.remainingAmount, 0);

    const paymentStatusPieData: ReportPieDataPoint[] = [
        { value: paidAmount, color: COLORS.success, text: 'Paid' },
        { value: pendingAmount, color: COLORS.warning, text: 'Pending' },
        { value: unpaidAmount, color: COLORS.danger, text: 'Unpaid' },
    ];

    return {
        salesOverviewData: bucketRows(invoiceRows, salesPeriod, (invoice) => invoice.createdAt, (invoice) => invoice.totalAmount),
        paymentStatusPieData: withPieFallback(paymentStatusPieData),
        paymentStatusLabels: [
            { color: 'bg-success', label: 'Paid Dues', value: formatCurrency(paidAmount) },
            { color: 'bg-warning', label: 'Pending Dues', value: formatCurrency(pendingAmount) },
            { color: 'bg-danger', label: 'Unpaid Dues', value: formatCurrency(unpaidAmount) },
        ],
        revenueData: bucketRows(
            invoiceRows,
            revenueProfitPeriod,
            (invoice) => invoice.createdAt,
            (invoice) => invoice.totalAmount,
        ),
        profitData: bucketRows(
            invoiceItemRows.filter((item) => item.invoice?.syncStatus !== 'pending_delete'),
            revenueProfitPeriod,
            (item) => item.invoice?.createdAt,
            (item) => item.profit,
        ).map(({ value }) => ({ value })),
    };
};

export const getPartyReportData = async (
    customerGrowthPeriod: TimePeriodType,
    customerRank: ProductRankingType,
    supplierRank: ProductRankingType,
): Promise<PartyReportData> => {
    const customerRows = await db.query.customers.findMany({
        where: ne(customers.syncStatus, 'pending_delete'),
        with: {
            createdBy: true,
            lastUpdatedBy: true,
        },
    });
    const supplierRows = await db.query.suppliers.findMany({
        where: ne(suppliers.syncStatus, 'pending_delete'),
        with: {
            createdBy: true,
            lastUpdatedBy: true,
        },
    });
    const mappedCustomers = customerRows.map(mapCustomerRowToPartyCustomer);
    const mappedSuppliers = supplierRows.map(mapSupplierRowToPartySupplier);
    const customerRankParams = rankToParams(customerRank);
    const supplierRankParams = rankToParams(supplierRank);
    const rankedCustomers = getTopBottomParties({
        parties: mappedCustomers,
        type: customerRankParams.type,
        limit: customerRankParams.limit,
        metric: 'total_purchases',
    });
    const rankedSuppliers = getTopBottomParties({
        parties: mappedSuppliers,
        type: supplierRankParams.type,
        limit: supplierRankParams.limit,
        metric: 'total_supply_value',
    });

    return {
        customerGrowthData: bucketRows(customerRows, customerGrowthPeriod, (customer) => customer.createdAt, () => 1),
        rankedCustomers,
        customersChartData: convertCustomersToGroupedBarData({
            customers: rankedCustomers,
            spendingColor: COLORS.primaryGreen,
            duesColor: COLORS.warning,
        }),
        rankedSuppliers,
        suppliersChartData: convertSuppliersToBarChartData({
            suppliers: rankedSuppliers,
            barColor: COLORS.primaryGreen,
        }),
    };
};

export const reportsRepository = {
    getStockReportData,
    getSalesReportData,
    getPartyReportData,
};
