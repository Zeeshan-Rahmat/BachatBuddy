import { CustomerType, EmployeeType, InvoiceType, ProductType, SupplierType, UserType } from "../types/appTypes";

// ==========================================
// 1. DEFAULT BASELINE USER REFERENCE
// ==========================================
export const defaultUser: UserType = {
    user_id: "",
    name: "Unknown User",
    phone: "",
    email: "",
    role: "Employee",
    username: "",
    password: "",
    status: "Active",
    biometric_enabled: false,
    address: "",
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString()
};

export const defaultEmployee: EmployeeType = {
    employee_id: "",
    name: "Unknown User",
    phone: "",
    email: "",
    role: "Employee",
    username: "",
    password: "",
    status: "Active",
    biometric_enabled: false,
    address: "",
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString()
};

// ==========================================
// 2. DEFAULT BASELINE SUPPLIER
// ==========================================
export const defaultSupplier: SupplierType = {
    supplier_id: "",
    created_by: defaultUser,
    last_updated_by: defaultUser,
    name: "New / Unknown Supplier",
    phone: "",
    email: "",
    address: "",
    status: "Active",
    supplied_products: 0,
    total_supply_value: 0,
    last_supplied_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString()
};

// ==========================================
// 3. DEFAULT BASELINE PRODUCT
// ==========================================
export const defaultProduct: ProductType = {
    product_id: "",
    created_by: defaultUser,
    last_updated_by: defaultUser,
    supplier: defaultSupplier,
    name: "Unnamed Product",
    purchase_price: 0,
    min_selling_price: 0,
    max_selling_price: 0,
    quantity: 0,
    minimum_quantity: 0,
    status: "Out of Stock",
    added_stock: 0,
    sold_stock: 0,
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString()
};

// ==========================================
// 4. DEFAULT BASELINE CUSTOMER
// ==========================================
export const defaultCustomer: CustomerType = {
    customer_id: "",
    created_by: defaultUser,
    last_updated_by: defaultUser,
    name: "Walk-in Customer",
    phone: "",
    email: "",
    address: "",
    status: "Active",
    total_purchases: 0,
    pending_dues: 0,
    total_orders: 0,
    last_purchase_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString()
};

// ==========================================
// 5. DEFAULT BASELINE INVOICE
// ==========================================
export const defaultInvoice: InvoiceType = {
    invoice_id: "",
    created_by: defaultUser,
    last_updated_by: defaultUser,
    customer: defaultCustomer,
    invoice_number: "INV-PENDING",
    invoice_items: [], // Instantiated clean and empty for line pushes
    subtotal: 0,
    discount: 0,
    discount_amount: 0,
    total_amount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    total_items: 0,
    status: "Unpaid",
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString()
};
