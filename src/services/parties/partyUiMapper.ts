import { defaultCustomer, defaultSupplier } from '@/src/constants/defaultData';
import type { CustomerRow, SupplierRow, UserRow } from '@/src/db/schema';
import { mapUserRowToAppUser } from '@/src/services/inventory/productUiMapper';
import type { CustomerType, EmployeeType, SupplierType } from '@/src/types/appTypes';

type CustomerRelationRow = CustomerRow & {
    createdBy: UserRow | null;
    lastUpdatedBy: UserRow | null;
};

type SupplierRelationRow = SupplierRow & {
    createdBy: UserRow | null;
    lastUpdatedBy: UserRow | null;
};

const toIsoString = (timestamp: number | null | undefined): string => {
    return timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
};

export const mapCustomerRowToPartyCustomer = (
    customer: CustomerRelationRow | CustomerRow | null | undefined
): CustomerType => {
    if (!customer) {
        return defaultCustomer;
    }

    const relationCustomer = customer as Partial<CustomerRelationRow>;

    return {
        customer_id: customer.id,
        created_by: mapUserRowToAppUser(relationCustomer.createdBy),
        last_updated_by: mapUserRowToAppUser(relationCustomer.lastUpdatedBy),
        name: customer.name,
        phone: customer.phone ?? '',
        email: customer.email ?? '',
        address: customer.address ?? '',
        status: customer.status,
        total_purchases: customer.totalPurchases,
        pending_dues: customer.pendingDues,
        total_orders: customer.totalOrders,
        img: customer.img ?? undefined,
        last_purchase_date: toIsoString(customer.lastPurchaseDate),
        created_at: toIsoString(customer.createdAt),
        last_updated_at: toIsoString(customer.updatedAt),
    };
};

export const mapSupplierRowToPartySupplier = (
    supplier: SupplierRelationRow | SupplierRow | null | undefined
): SupplierType => {
    if (!supplier) {
        return defaultSupplier;
    }

    const relationSupplier = supplier as Partial<SupplierRelationRow>;

    return {
        supplier_id: supplier.id,
        created_by: mapUserRowToAppUser(relationSupplier.createdBy),
        last_updated_by: mapUserRowToAppUser(relationSupplier.lastUpdatedBy),
        name: supplier.name,
        phone: supplier.phone ?? '',
        email: supplier.email ?? '',
        address: supplier.address ?? '',
        status: supplier.status,
        supplied_products: supplier.suppliedProducts,
        total_supply_value: supplier.totalSupplyValue,
        img: supplier.img ?? undefined,
        last_supplied_date: toIsoString(supplier.lastSuppliedDate),
        created_at: toIsoString(supplier.createdAt),
        last_updated_at: toIsoString(supplier.updatedAt),
    };
};

export const mapEmployeeRowToPartyEmployee = (employee: UserRow): EmployeeType => {
    return {
        employee_id: employee.id,
        name: employee.name,
        phone: employee.phone ?? '',
        email: employee.email,
        role: 'Employee',
        username: employee.username,
        password: '',
        status: employee.status,
        biometric_enabled: employee.biometricEnabled,
        address: employee.address ?? '',
        img: employee.img ?? undefined,
        created_at: toIsoString(employee.createdAt),
        last_updated_at: toIsoString(employee.updatedAt),
    };
};
