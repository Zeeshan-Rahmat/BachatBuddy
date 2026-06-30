import { ne } from 'drizzle-orm';
import { db } from '../client';
import { customers, invoiceItems, invoices, products } from '../schema';

export type DashboardStat = {
    value: number;
    trendPercent: number;
    trendUp: boolean;
};

export type DashboardSummaryData = {
    totalStock: DashboardStat;
    totalSales: DashboardStat;
    activeCustomers: DashboardStat;
    remainingLoans: DashboardStat;
    lowStockCount: number;
    pendingDues: number;
    profit: number;
    invoiceCount: number;
    topProductName: string;
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const getTrendPercent = (current: number, previous: number): number => {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }

    return Math.round(((current - previous) / previous) * 100);
};

const sumNumbers = <T>(rows: T[], getValue: (row: T) => number): number => (
    rows.reduce((total, row) => total + getValue(row), 0)
);

export const getDashboardSummaryData = async (): Promise<DashboardSummaryData> => {
    const now = Date.now();
    const currentPeriodStart = now - THIRTY_DAYS_MS;
    const previousPeriodStart = currentPeriodStart - THIRTY_DAYS_MS;

    const [productRows, invoiceRows, invoiceItemRows, customerRows] = await Promise.all([
        db.select().from(products).where(ne(products.syncStatus, 'pending_delete')),
        db.select().from(invoices).where(ne(invoices.syncStatus, 'pending_delete')),
        db.select().from(invoiceItems).where(ne(invoiceItems.syncStatus, 'pending_delete')),
        db.select().from(customers).where(ne(customers.syncStatus, 'pending_delete')),
    ]);

    const currentProductRows = productRows.filter((product) => product.createdAt >= currentPeriodStart);
    const previousProductRows = productRows.filter(
        (product) => product.createdAt >= previousPeriodStart && product.createdAt < currentPeriodStart,
    );
    const currentInvoiceRows = invoiceRows.filter((invoice) => invoice.createdAt >= currentPeriodStart);
    const previousInvoiceRows = invoiceRows.filter(
        (invoice) => invoice.createdAt >= previousPeriodStart && invoice.createdAt < currentPeriodStart,
    );
    const currentCustomerRows = customerRows.filter((customer) => customer.createdAt >= currentPeriodStart);
    const previousCustomerRows = customerRows.filter(
        (customer) => customer.createdAt >= previousPeriodStart && customer.createdAt < currentPeriodStart,
    );

    const totalStock = sumNumbers(productRows, (product) => product.quantity);
    const currentAddedStock = sumNumbers(currentProductRows, (product) => product.addedStock);
    const previousAddedStock = sumNumbers(previousProductRows, (product) => product.addedStock);
    const totalSalesAmount = sumNumbers(invoiceRows, (invoice) => invoice.totalAmount);
    const currentSalesAmount = sumNumbers(currentInvoiceRows, (invoice) => invoice.totalAmount);
    const previousSalesAmount = sumNumbers(previousInvoiceRows, (invoice) => invoice.totalAmount);
    const salesTrend = getTrendPercent(currentSalesAmount, previousSalesAmount);
    const stockTrend = getTrendPercent(currentAddedStock, previousAddedStock);
    const customerTrend = getTrendPercent(currentCustomerRows.length, previousCustomerRows.length);
    const currentRemainingLoans = sumNumbers(currentInvoiceRows, (invoice) => invoice.remainingAmount);
    const previousRemainingLoans = sumNumbers(previousInvoiceRows, (invoice) => invoice.remainingAmount);
    const loansTrend = getTrendPercent(currentRemainingLoans, previousRemainingLoans);
    const activeCustomerRows = customerRows.filter((customer) => customer.status === 'Active');
    const topProduct = [...productRows].sort((first, second) => second.soldStock - first.soldStock)[0];

    return {
        totalStock: {
            value: totalStock,
            trendPercent: stockTrend,
            trendUp: stockTrend >= 0,
        },
        totalSales: {
            value: totalSalesAmount,
            trendPercent: salesTrend,
            trendUp: salesTrend >= 0,
        },
        activeCustomers: {
            value: activeCustomerRows.length,
            trendPercent: customerTrend,
            trendUp: customerTrend >= 0,
        },
        remainingLoans: {
            value: sumNumbers(invoiceRows, (invoice) => invoice.remainingAmount),
            trendPercent: loansTrend,
            trendUp: loansTrend <= 0,
        },
        lowStockCount: productRows.filter((product) => product.status === 'Low Stock').length,
        pendingDues: sumNumbers(invoiceRows, (invoice) => invoice.remainingAmount),
        profit: sumNumbers(invoiceItemRows, (item) => item.profit),
        invoiceCount: invoiceRows.length,
        topProductName: topProduct && topProduct.soldStock > 0 ? topProduct.name : 'None',
    };
};

export const dashboardRepository = {
    getDashboardSummaryData,
};
