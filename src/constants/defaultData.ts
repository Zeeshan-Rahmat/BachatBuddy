import { CustomerType, InvoiceType, ProductType, SupplierType, UserType } from "../types/appTypes"

const mockUsers: UserType[] = [
    {
        user_id: "usr_001",
        name: "Alex Mercer",
        phone: "+1-555-0198",
        email: "alex.mercer@company.com",
        role: "Admin",
        username: "alex_admin",
        password: "$2b$10$n9WdY3xZ8...",
        status: "Active",
        biometric_enabled: true,
        address: "742 Evergreen Terrace, Springfield",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        created_at: "2026-01-10T08:00:00Z",
        last_updated_at: "2026-06-15T14:30:00Z"
    },
    {
        user_id: "usr_002",
        name: "Sarah Jenkins",
        phone: "+1-555-0147",
        email: "sarah.j@company.com",
        role: "Employee",
        username: "sarah_j",
        password: "$2b$10$eK9xP2wM1...",
        status: "Active",
        biometric_enabled: true,
        address: "123 Main Street, New York, NY",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        created_at: "2026-02-14T09:15:00Z",
        last_updated_at: "2026-05-20T11:22:00Z"
    },
    {
        user_id: "usr_003",
        name: "Michael Chang",
        phone: "+1-555-0163",
        email: "m.chang@company.com",
        role: "Employee",
        username: "mike_c",
        password: "$2b$10$u8VwX7zN3...",
        status: "Active",
        biometric_enabled: false,
        address: "456 Oak Avenue, San Francisco, CA",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        created_at: "2026-03-01T07:45:00Z",
        last_updated_at: "2026-03-01T07:45:00Z"
    },
]

export const defaultSupplier: SupplierType = {
    supplier_id: "sup_001",
    created_by: mockUsers[0],
    last_updated_by: mockUsers[1],
    name: "Apex Tech Distributors",
    phone: "+1-800-555-0100",
    email: "orders@apextech.com",
    address: "100 Logistics Way, Chicago, IL",
    status: "Active",
    supplied_products: 45,
    total_supply_value: 125000.50,
    img: "https://api.dicebear.com/7.x/identicon/svg?seed=Apex",
    last_purchase_date: "2026-06-10T14:00:00Z",
    created_at: "2026-01-15T11:00:00Z",
    last_updated_at: "2026-06-10T15:30:00Z"
}

export const defaultProduct: ProductType = {
    product_id: 1001,
    created_by: mockUsers[0],
    last_updated_by: mockUsers[2], // Updated by inventory clerk Emily
    supplier: defaultSupplier, // Supplied by Apex Tech
    name: "Wireless Mechanical Keyboard",
    purchase_price: 45.00,
    min_selling_price: 79.99,
    max_selling_price: 99.99,
    quantity: 120,
    minimum_quantity: 20,
    status: "In Stock",
    added_stock: 150,
    sold_stock: 30,
    img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200",
    created_at: "2026-01-20T10:00:00Z",
    last_updated_at: "2026-06-18T15:40:00Z"
}

export const defaultProduct2: ProductType = {
    product_id: 1002,
    created_by: mockUsers[1],
    last_updated_by: mockUsers[0],
    supplier: defaultSupplier,
    name: "Ergonomic Bluetooth Mouse",
    purchase_price: 18.50,
    min_selling_price: 29.99,
    max_selling_price: 39.99,
    quantity: 8,
    minimum_quantity: 15,
    status: "Low Stock", // Low Stock trigger (8 < 15)
    added_stock: 50,
    sold_stock: 42,
    img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200",
    created_at: "2026-01-22T14:30:00Z",
    last_updated_at: "2026-06-19T09:12:00Z"
}



export const defaultCustomer: CustomerType =
{
    customer_id: "cust_001",
    created_by: mockUsers[2], // Created by Cashier Michael
    last_updated_by: mockUsers[2],
    name: "John Doe",
    phone: "+1-555-4433",
    email: "johndoe@email.com",
    address: "12 Treehouse Lane, Orlando, FL",
    status: "Active",
    total_purchases: 1450.75,
    pending_dues: 0.00,
    total_orders: 12,
    img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=John",
    last_purchase_date: "2026-06-18T15:20:00Z",
    created_at: "2026-01-22T10:30:00Z",
    last_updated_at: "2026-06-18T15:25:00Z"
};

export const defaultInvoice: InvoiceType = {
    invoice_id: "inv_1001",
    created_by: mockUsers[2], // Cashier Michael
    last_updated_by: mockUsers[2],
    customer: defaultCustomer, // John Doe
    invoice_number: "INV-2026-001",
    invoice_items: [
        {
            invoice_item_id: "initm_101",
            product: defaultProduct, // Wireless Mechanical Keyboard
            quantity: 1,
            purchase_price: 45.00,
            selling_price: 89.99,
            subtotal: 89.99,
            profit: 44.99
        },
        {
            invoice_item_id: "initm_102",
            product: defaultProduct2, // Ergonomic Mouse
            quantity: 2,
            purchase_price: 18.50,
            selling_price: 34.99,
            subtotal: 69.98,
            profit: 32.98
        }
    ],
    subtotal: 159.97,
    discount: 10, // 10% Off
    discount_amount: 16.00,
    total_amount: 143.97,
    paid_amount: 143.97,
    remaining_amount: 0.00,
    total_items: 3,
    status: "Paid",
    due_date: "2026-06-10T12:00:00Z",
    img: "https://api.dicebear.com/7.x/identicon/svg?seed=INV001",
    created_at: "2026-06-10T11:45:00Z",
    last_updated_at: "2026-06-10T11:55:00Z"
};