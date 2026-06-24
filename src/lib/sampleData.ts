
// ==========================================
// 1. USER MOCK DATA (5 Records)

import { CustomerType, InvoiceType, ProductType, SupplierType, UserType } from "../types/appTypes";

// ==========================================
export const mockUsers: UserType[] = [
    {
        user_id: "usr_001",
        name: "Alex Mercer",
        phone: "+1-555-0198",
        email: "alex.mercer@company.com",
        role: "Admin",
        username: "alex_admin",
        password: "$2b$10$n9WdY3xZ8...", // Mock Hashed PW
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
        role: "Manager",
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
        role: "Cashier",
        username: "mike_c",
        password: "$2b$10$u8VwX7zN3...",
        status: "Active",
        biometric_enabled: false,
        address: "456 Oak Avenue, San Francisco, CA",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        created_at: "2026-03-01T07:45:00Z",
        last_updated_at: "2026-03-01T07:45:00Z"
    },
    {
        user_id: "usr_004",
        name: "Emily Rodriguez",
        phone: "+1-555-0122",
        email: "emily.r@company.com",
        role: "Inventory Clerk",
        username: "emily_stocks",
        password: "$2b$10$b3YtK8sR1...",
        status: "Active",
        biometric_enabled: true,
        address: "789 Pine Road, Austin, TX",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        created_at: "2026-04-10T10:30:00Z",
        last_updated_at: "2026-06-18T16:15:00Z"
    },
    {
        user_id: "usr_005",
        name: "David Kim",
        phone: "+1-555-0155",
        email: "d.kim@company.com",
        role: "Cashier",
        username: "david_k",
        password: "$2b$10$p4LmQ9sW2...",
        status: "Inactive",
        biometric_enabled: false,
        address: "321 Elm Blvd, Seattle, WA",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        created_at: "2026-01-20T13:00:00Z",
        last_updated_at: "2026-05-01T09:00:00Z"
    }
];

// ==========================================
// 2. SUPPLIER MOCK DATA (5 Records)
// ==========================================
export const mockSuppliers: SupplierType[] = [
    {
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
        last_supplied_date: "2026-06-10T14:00:00Z",
        created_at: "2026-01-15T11:00:00Z",
        last_updated_at: "2026-06-10T15:30:00Z"
    },
    {
        supplier_id: "sup_002",
        created_by: mockUsers[0],
        last_updated_by: mockUsers[0],
        name: "Global Office Solutions",
        phone: "+1-800-555-0211",
        email: "support@globaloffice.com",
        address: "500 Enterprise Dr, Miami, FL",
        status: "Active",
        supplied_products: 120,
        total_supply_value: 45200.00,
        img: "https://api.dicebear.com/7.x/identicon/svg?seed=Global",
        last_supplied_date: "2026-06-15T09:00:00Z",
        created_at: "2026-01-20T09:30:00Z",
        last_updated_at: "2026-06-15T10:00:00Z"
    },
    {
        supplier_id: "sup_003",
        created_by: mockUsers[1],
        last_updated_by: mockUsers[3],
        name: "Elite Ergonomics Ltd",
        phone: "+1-888-555-0344",
        email: "sales@eliteergo.com",
        address: "88 Comfort Lane, Portland, OR",
        status: "Active",
        supplied_products: 12,
        total_supply_value: 89000.00,
        img: "https://api.dicebear.com/7.x/identicon/svg?seed=Elite",
        last_supplied_date: "2026-05-28T16:45:00Z",
        created_at: "2026-02-18T14:20:00Z",
        last_updated_at: "2026-05-28T17:00:00Z"
    },
    {
        supplier_id: "sup_004",
        created_by: mockUsers[1],
        last_updated_by: mockUsers[1],
        name: "Nexus Freight & Goods",
        phone: "+1-877-555-0989",
        email: "contact@nexusgoods.net",
        address: "244 Industrial Pkwy, Denver, CO",
        status: "Active",
        supplied_products: 78,
        total_supply_value: 61350.75,
        img: "https://api.dicebear.com/7.x/identicon/svg?seed=Nexus",
        last_supplied_date: "2026-06-02T11:15:00Z",
        created_at: "2026-03-05T10:00:00Z",
        last_updated_at: "2026-06-02T12:00:00Z"
    },
    {
        supplier_id: "sup_005",
        created_by: mockUsers[0],
        last_updated_by: mockUsers[3],
        name: "Legacy Media Suppliers",
        phone: "+1-800-555-0432",
        email: "billing@legacymedia.com",
        address: "12 Vintage Way, Boston, MA",
        status: "Inactive",
        supplied_products: 5,
        total_supply_value: 3400.00,
        img: "https://api.dicebear.com/7.x/identicon/svg?seed=Legacy",
        last_supplied_date: "2026-02-10T13:20:00Z",
        created_at: "2026-01-11T08:45:00Z",
        last_updated_at: "2026-04-19T10:30:00Z"
    }
];

// ==========================================
// 3. CUSTOMER MOCK DATA (5 Records)
// ==========================================
export const mockCustomers: CustomerType[] = [
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
    },
    {
        customer_id: "cust_002",
        created_by: mockUsers[2],
        last_updated_by: mockUsers[1],
        name: "Jane Smith Logistics",
        phone: "+1-555-8877",
        email: "corporate@janesmith.biz",
        address: "898 Commercial Ave, Ste 400, Phoenix, AZ",
        status: "Active",
        total_purchases: 18900.00,
        pending_dues: 2400.50, // Has outstanding balance
        total_orders: 34,
        img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane",
        last_purchase_date: "2026-06-14T11:45:00Z",
        created_at: "2026-02-05T14:10:00Z",
        last_updated_at: "2026-06-14T12:00:00Z"
    },
    {
        customer_id: "cust_003",
        created_by: mockUsers[3],
        last_updated_by: mockUsers[3],
        name: "Robert Downey",
        phone: "+1-555-9911",
        email: "rdj@starkindustries.io",
        address: "10880 Malibu Point, Malibu, CA",
        status: "Active",
        total_purchases: 74500.00,
        pending_dues: 0.00,
        total_orders: 8,
        img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Robert",
        last_purchase_date: "2026-05-19T16:00:00Z",
        created_at: "2026-03-12T09:00:00Z",
        last_updated_at: "2026-05-19T16:30:00Z"
    },
    {
        customer_id: "cust_004",
        created_by: mockUsers[2],
        last_updated_by: mockUsers[2],
        name: "Clara Oswald",
        phone: "+1-555-2266",
        email: "clara.os@yahoo.com",
        address: "42 TARDIS Way, London, UK",
        status: "Active",
        total_purchases: 320.40,
        pending_dues: 45.00,
        total_orders: 3,
        img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Clara",
        last_purchase_date: "2026-06-01T10:15:00Z",
        created_at: "2026-05-02T11:00:00Z",
        last_updated_at: "2026-06-01T10:15:00Z"
    },
    {
        customer_id: "cust_005",
        created_by: mockUsers[0],
        last_updated_by: mockUsers[1],
        name: "Arthur Dent",
        phone: "+1-555-4242",
        email: "dontpanic@hitchhiker.org",
        address: "Country Lane, Cottington, UK",
        status: "Inactive",
        total_purchases: 42.00,
        pending_dues: 0.00,
        total_orders: 1,
        img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Arthur",
        last_purchase_date: "2026-01-25T12:00:00Z",
        created_at: "2026-01-25T11:45:00Z",
        last_updated_at: "2026-02-10T14:00:00Z"
    }
];

// ==========================================
// 4. PRODUCT MOCK DATA (5 Records)
// ==========================================
export const mockProducts: ProductType[] = [
    {
        product_id: 1001,
        created_by: mockUsers[0],
        last_updated_by: mockUsers[3], // Updated by inventory clerk Emily
        supplier: mockSuppliers[0], // Supplied by Apex Tech
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
    },
    {
        product_id: 1002,
        created_by: mockUsers[1],
        last_updated_by: mockUsers[3],
        supplier: mockSuppliers[0],
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
    },
    {
        product_id: 1003,
        created_by: mockUsers[0],
        last_updated_by: mockUsers[1],
        supplier: mockSuppliers[2], // Supplied by Elite Ergonomics
        name: "Premium Mesh Executive Chair",
        purchase_price: 150.00,
        min_selling_price: 249.99,
        max_selling_price: 299.99,
        quantity: 0,
        minimum_quantity: 5,
        status: "Out of Stock", // Completely out of stock
        added_stock: 20,
        sold_stock: 20,
        img: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=200",
        created_at: "2026-02-20T11:00:00Z",
        last_updated_at: "2026-06-12T16:45:00Z"
    },
    {
        product_id: 1004,
        created_by: mockUsers[1],
        last_updated_by: mockUsers[1],
        supplier: mockSuppliers[1], // Supplied by Global Office Solutions
        name: "Eco-Friendly Gel Wrist Rest",
        purchase_price: 4.20,
        min_selling_price: 9.99,
        max_selling_price: 14.99,
        quantity: 340,
        minimum_quantity: 50,
        status: "In Stock",
        added_stock: 400,
        sold_stock: 60,
        img: undefined,
        created_at: "2026-01-25T09:15:00Z",
        last_updated_at: "2026-05-14T11:00:00Z"
    },
    {
        product_id: 1005,
        created_by: mockUsers[0],
        last_updated_by: mockUsers[3],
        supplier: mockSuppliers[3], // Supplied by Nexus Freight
        name: "Ultra-Wide 34\" Curved Monitor",
        purchase_price: 280.00,
        min_selling_price: 399.99,
        max_selling_price: 499.99,
        quantity: 15,
        minimum_quantity: 5,
        status: "In Stock",
        added_stock: 25,
        sold_stock: 10,
        img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200",
        created_at: "2026-03-10T15:00:00Z",
        last_updated_at: "2026-06-01T13:20:00Z"
    }
];

export const mockInvoices: InvoiceType[] = [
    {
        invoice_id: "inv_1001",
        created_by: mockUsers[2], // Cashier Michael
        last_updated_by: mockUsers[2],
        customer: mockCustomers[0], // John Doe
        invoice_number: "INV-2026-001",
        invoice_items: [
            {
                invoice_item_id: "initm_101",
                product: mockProducts[0], // Wireless Mechanical Keyboard
                quantity: 1,
                purchase_price: 45.00,
                selling_price: 89.99,
                subtotal: 89.99,
                profit: 44.99
            },
            {
                invoice_item_id: "initm_102",
                product: mockProducts[1], // Ergonomic Mouse
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
    },
    {
        invoice_id: "inv_1002",
        created_by: mockUsers[2], // Cashier Michael
        last_updated_by: mockUsers[1], // Manager Sarah verified
        customer: mockCustomers[1], // Jane Smith Logistics
        invoice_number: "INV-2026-002",
        invoice_items: [
            {
                invoice_item_id: "initm_103",
                product: mockProducts[4], // Ultra-Wide 34" Curved Monitor
                quantity: 2,
                purchase_price: 280.00,
                selling_price: 449.99,
                subtotal: 899.98,
                profit: 339.98
            }
        ],
        subtotal: 899.98,
        discount: 0,
        discount_amount: 0.00,
        total_amount: 899.98,
        paid_amount: 500.00, // Partial payment made
        remaining_amount: 399.98,
        total_items: 2,
        status: "Pending",
        due_date: "2026-07-15T17:00:00Z",
        created_at: "2026-06-15T14:20:00Z",
        last_updated_at: "2026-06-16T09:30:00Z"
    },
    {
        invoice_id: "inv_1003",
        created_by: mockUsers[2],
        last_updated_by: mockUsers[2],
        customer: mockCustomers[2], // Robert Downey
        invoice_number: "INV-2026-003",
        invoice_items: [
            {
                invoice_item_id: "initm_104",
                product: mockProducts[2], // Premium Mesh Executive Chair
                quantity: 4,
                purchase_price: 150.00,
                selling_price: 270.00,
                subtotal: 1080.00,
                profit: 480.00
            }
        ],
        subtotal: 1080.00,
        discount: 5, // 5% Flat Corporate Markdown
        discount_amount: 54.00,
        total_amount: 1026.00,
        paid_amount: 1026.00,
        remaining_amount: 0.00,
        total_items: 4,
        status: "Paid",
        due_date: "2026-06-17T10:00:00Z",
        created_at: "2026-06-17T09:15:00Z",
        last_updated_at: "2026-06-17T10:00:00Z"
    },
    {
        invoice_id: "inv_1004",
        created_by: mockUsers[3], // Inventory Clerk Emily
        last_updated_by: mockUsers[3],
        customer: mockCustomers[3], // Clara Oswald
        invoice_number: "INV-2026-004",
        invoice_items: [
            {
                invoice_item_id: "initm_105",
                product: mockProducts[3], // Eco-Friendly Gel Wrist Rest
                quantity: 5,
                purchase_price: 4.20,
                selling_price: 12.00,
                subtotal: 60.00,
                profit: 39.00
            }
        ],
        subtotal: 60.00,
        discount: 0,
        discount_amount: 0.00,
        total_amount: 60.00,
        paid_amount: 0.00, // Fully Unpaid / Delivered on Credit Terms
        remaining_amount: 60.00,
        total_items: 5,
        status: "Unpaid",
        due_date: "2026-06-25T12:00:00Z",
        created_at: "2026-06-18T10:30:00Z",
        last_updated_at: "2026-06-18T10:30:00Z"
    },
    {
        invoice_id: "inv_1005",
        created_by: mockUsers[2],
        last_updated_by: mockUsers[1],
        customer: mockCustomers[1], // Jane Smith Logistics
        invoice_number: "INV-2026-005",
        invoice_items: [
            {
                invoice_item_id: "initm_106",
                product: mockProducts[0], // Wireless Mechanical Keyboard
                quantity: 10,
                purchase_price: 45.00,
                selling_price: 85.00,
                subtotal: 850.00,
                profit: 400.00
            },
            {
                invoice_item_id: "initm_107",
                product: mockProducts[1], // Ergonomic Mouse
                quantity: 10,
                purchase_price: 18.50,
                selling_price: 30.00,
                subtotal: 300.00,
                profit: 115.00
            }
        ],
        subtotal: 1150.00,
        discount: 12, // Bulk Procurement Rate Cut
        discount_amount: 138.00,
        total_amount: 1012.00,
        paid_amount: 0.00,
        remaining_amount: 1012.00,
        total_items: 20,
        status: "Unpaid",
        due_date: "2026-07-02T16:00:00Z",
        created_at: "2026-06-19T15:10:00Z",
        last_updated_at: "2026-06-19T16:00:00Z"
    },
    {
        invoice_id: "inv_1006",
        created_by: mockUsers[2],
        last_updated_by: mockUsers[2],
        customer: mockCustomers[0], // John Doe
        invoice_number: "INV-2026-006",
        invoice_items: [
            {
                invoice_item_id: "initm_108",
                product: mockProducts[3], // Eco-Friendly Gel Wrist Rest
                quantity: 1,
                purchase_price: 4.20,
                selling_price: 14.99,
                subtotal: 14.99,
                profit: 10.79
            }
        ],
        subtotal: 14.99,
        discount: 0,
        discount_amount: 0.00,
        total_amount: 14.99,
        paid_amount: 14.99,
        remaining_amount: 0.00,
        total_items: 1,
        status: "Paid",
        due_date: "2026-06-20T11:00:00Z",
        created_at: "2026-06-20T10:15:00Z",
        last_updated_at: "2026-06-20T10:20:00Z"
    },
    {
        invoice_id: "inv_1007",
        created_by: mockUsers[0], // Admin Alex
        last_updated_by: mockUsers[0],
        customer: mockCustomers[4], // Arthur Dent
        invoice_number: "INV-2026-007",
        invoice_items: [
            {
                invoice_item_id: "initm_109",
                product: mockProducts[1], // Ergonomic Mouse
                quantity: 1,
                purchase_price: 18.50,
                selling_price: 39.99,
                subtotal: 39.99,
                profit: 21.49
            }
        ],
        subtotal: 39.99,
        discount: 0,
        discount_amount: 0.00,
        total_amount: 39.99,
        paid_amount: 15.00, // Small down payment token
        remaining_amount: 24.99,
        total_items: 1,
        status: "Pending",
        due_date: "2026-07-20T00:00:00Z",
        created_at: "2026-06-20T14:00:00Z",
        last_updated_at: "2026-06-20T14:45:00Z"
    }
];