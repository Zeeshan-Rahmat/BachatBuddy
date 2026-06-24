export type DateRangeFilterType = 'Today' | 'This Week' | 'This Month' | '';
export type StockStatusFilterType = StockStatusType | '';
export type PartyStatusFilterType = PartyStatusType | '';
export type InvoiceStatusFilterType = InvoiceStatusType | '';

export type StatusColorType = StockStatusType | PartyStatusType | InvoiceStatusType;

export type AnyStatusFilterType = StockStatusFilterType | InvoiceStatusFilterType | PartyStatusFilterType;

export type AnyItemType = ProductType | InvoiceType | EmployeeType | CustomerType | SupplierType;

export type PartyType = EmployeeType | CustomerType | SupplierType;

export type FilterType = {
    fromDate: string;
    toDate: string;
    activeRange: DateRangeFilterType;
    activeStatus: AnyStatusFilterType;
    selectedUser: string;
    sortBy: string;
}

export type StockStatusType = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type PartyStatusType = 'Active' | 'Inactive';
export type InvoiceStatusType = 'Paid' | 'Pending' | 'Unpaid';
export type RoleType = 'Owner' | 'Employee';

export type UserType = {
    user_id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    username: string;
    password: string;
    status: PartyStatusType;
    biometric_enabled: boolean;
    address: string;
    img?: string;
    created_at: Date | string;
    last_updated_at: Date | string;
}

export type EmployeeType = {
    employee_id: string;
    created_by: UserType;
    last_updated_by: UserType;
    name: string;
    phone: string;
    email: string;
    role: string;
    username: string;
    password: string;
    status: PartyStatusType;
    biometric_enabled: boolean;
    address: string;
    img?: string;
    created_at: Date | string;
    last_updated_at: Date | string;
}

export type CustomerType = {
    customer_id: string;
    created_by: UserType;
    last_updated_by: UserType;
    name: string;
    phone: string;
    email: string;
    address: string;
    status: PartyStatusType;
    total_purchases: number;
    pending_dues: number;
    total_orders: number;
    img?: string;
    last_purchase_date: Date | string;
    created_at: Date | string;
    last_updated_at: Date | string;
}

export type SupplierType = {
    supplier_id: string;
    created_by: UserType;
    last_updated_by: UserType;
    name: string;
    phone: string;
    email: string;
    address: string;
    status: PartyStatusType;
    supplied_products: number;
    total_supply_value: number;
    img?: string;
    last_supplied_date: Date | string; // <-- Change This to supplied 
    created_at: Date | string;
    last_updated_at: Date | string;
}

export type ProductType = {
    product_id: number;
    created_by: UserType;
    last_updated_by: UserType;
    supplier: SupplierType;
    name: string;
    purchase_price: number;
    min_selling_price: number;
    max_selling_price: number;
    quantity: number;
    minimum_quantity: number;
    status: StockStatusType;
    added_stock: number;
    sold_stock: number;
    img?: string;
    created_at: Date | string;
    last_updated_at: Date | string;
};

export type InvoiceItemType = {
    invoice_item_id: string;
    product: ProductType;
    quantity: number;
    purchase_price: number;
    selling_price: number;
    subtotal: number;
    profit: number;
};

export type InvoiceType = {
    invoice_id: string;
    created_by: UserType;
    last_updated_by: UserType;
    customer: CustomerType;
    invoice_number: string;
    invoice_items: InvoiceItemType[];
    subtotal: number;
    discount: number;
    discount_amount: number;
    total_amount: number;
    paid_amount: number;
    remaining_amount: number;
    total_items: number;
    status: InvoiceStatusType;
    due_date: Date | string;
    img?: string;
    created_at: Date | string;
    last_updated_at: Date | string;
};

export type ItemType = {
    id: string;
    title: string;
    status: string;
    updatedBy?: string;
    updatedAt?: Date;
    createdBy?: string;
    createdAt?: Date;
    name?: string;
    city?: string;
    qty?: number;
    amount?: number;
    minAmount?: number;
    maxAmount?: number;
    email?: string;
    img?: string;
};


export type TimePeriodType = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
export type ProductRankingType = 'Top 5' | 'Top 10' | 'Bottom 5' | 'Bottom 10';

export interface ReportFilterType {
    values: string[];
    value: string;
    onChange: (val: string) => void;
}

export interface LegendLineChartType {
    label: string;
    color: string;
    dotColor: string;
}

export interface LegendPieChartType {
    color: string;
    label: string;
    value: string;
}
export interface ChartScaleType {
    maxValue: number;
    noOfSections: number;
}