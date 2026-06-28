import { defaultSupplier, defaultUser } from '@/src/constants/defaultData';
import type { ProductType, SupplierType, UserType } from '@/src/types/appTypes';
import type { ProductRow, SupplierRow, UserRow } from '@/src/db/schema';

type ProductRelationRow = ProductRow & {
    supplier: SupplierRow | null;
    createdBy: UserRow | null;
    lastUpdatedBy: UserRow | null;
};

const toIsoString = (timestamp: number | null | undefined): string => {
    return timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
};

export const mapUserRowToAppUser = (user: UserRow | null | undefined): UserType => {
    if (!user) {
        return defaultUser;
    }

    return {
        user_id: user.id,
        name: user.name,
        phone: user.phone ?? '',
        email: user.email,
        role: user.role === 'owner' ? 'Owner' : 'Employee',
        username: user.username,
        password: '',
        status: user.status,
        biometric_enabled: user.biometricEnabled,
        address: user.address ?? '',
        img: user.img ?? undefined,
        created_at: toIsoString(user.createdAt),
        last_updated_at: toIsoString(user.updatedAt),
    };
};

export const mapSupplierRowToAppSupplier = (supplier: SupplierRow | null | undefined): SupplierType => {
    if (!supplier) {
        return defaultSupplier;
    }

    return {
        supplier_id: supplier.id,
        created_by: defaultUser,
        last_updated_by: defaultUser,
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

export const mapProductRowToAppProduct = (product: ProductRelationRow): ProductType => {
    return {
        product_id: product.id,
        created_by: mapUserRowToAppUser(product.createdBy),
        last_updated_by: mapUserRowToAppUser(product.lastUpdatedBy),
        supplier: mapSupplierRowToAppSupplier(product.supplier),
        name: product.name,
        purchase_price: product.purchasePrice,
        min_selling_price: product.minSellingPrice,
        max_selling_price: product.maxSellingPrice,
        quantity: product.quantity,
        minimum_quantity: product.minimumQuantity,
        status: product.status,
        added_stock: product.addedStock,
        sold_stock: product.soldStock,
        img: product.img ?? undefined,
        created_at: toIsoString(product.createdAt),
        last_updated_at: toIsoString(product.updatedAt),
    };
};
