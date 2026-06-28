import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InternalTabBar from '@/src/components/common/InternalTabBar';
import SearchFilter from '@/src/components/common/SearchFilter';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import InvoiceItemProductCard from '@/src/components/ui/InvoiceItemProductCard';
import { ICONS } from '@/src/constants/icons';
import { listProductsWithRelations } from '@/src/db/repositories/productsRepository';
import { mapProductRowToAppProduct } from '@/src/services/inventory/productUiMapper';
import { InvoiceItemType, ProductType } from '@/src/types/appTypes';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

interface EditInvoiceProductsModalProps {
    visible: boolean;
    selectedProducts?: InvoiceItemType[];
    setSelectedProducts?: React.Dispatch<React.SetStateAction<InvoiceItemType[] | undefined>>;
    onClose: () => void;
}


const TABS = ['Selected Products', 'All Products'];

const EditInvoiceProductsModal = ({
    visible,
    selectedProducts,
    setSelectedProducts,
    onClose

}: EditInvoiceProductsModalProps

) => {

    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedProductsUpdate, setSelectedProductsUpdate] = useState<InvoiceItemType[]>(selectedProducts ?? []);
    const [activeTab, setActiveTab] = useState('Selected Products');

    const [search, setSearch] = useState('');

    const loadProducts = useCallback(async () => {
        setLoading(true);

        try {
            const rows = await listProductsWithRelations();
            setProducts(rows.map(mapProductRowToAppProduct));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            void loadProducts();
        }
    }, [loadProducts, visible]);

    const filtered = products.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedQuantityByProductId = useMemo(() => {
        return selectedProductsUpdate.reduce<Record<string, number>>((result, item) => {
            result[item.product.product_id] = item.quantity;
            return result;
        }, {});
    }, [selectedProductsUpdate]);

    const handleProductQuantityChange = (product: ProductType, quantity: number, sellingPrice: number) => {
        setSelectedProductsUpdate((currentItems) => {
            const existingItem = currentItems.find((item) => item.product.product_id === product.product_id);

            if (quantity <= 0) {
                return currentItems.filter((item) => item.product.product_id !== product.product_id);
            }

            if (existingItem) {
                return currentItems.map((item) => {
                    if (item.product.product_id !== product.product_id) {
                        return item;
                    }

                    const subtotal = quantity * sellingPrice;

                    return {
                        ...item,
                        quantity,
                        selling_price: sellingPrice,
                        subtotal,
                        profit: quantity * (sellingPrice - product.purchase_price),
                    };
                });
            }

            return [
                ...currentItems,
                {
                    invoice_item_id: crypto.randomUUID(),
                    product,
                    quantity,
                    purchase_price: product.purchase_price,
                    selling_price: sellingPrice,
                    subtotal: quantity * sellingPrice,
                    profit: quantity * (sellingPrice - product.purchase_price),
                },
            ];
        });
    };

    const handleDone = () => {
        setSelectedProducts?.(selectedProductsUpdate);
        onClose();
    }

    return (
        <CustomModal visible={visible}>
            <Title text='Add Product' />

            <SearchFilter
                value={search}
                searchPlaceholder='Search Products'
                hasFilter={false}
                onChangeText={setSearch}
            />

            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            {
                activeTab === "Selected Products"
                    ? (
                        selectedProductsUpdate.length > 0
                            ? (
                                <FlatList
                                    data={selectedProductsUpdate}
                                    keyExtractor={i => i.invoice_item_id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    className='min-h-80 max-h-100 mt-3'

                                    renderItem={({ item: invoiceItem }) => (
                                        <InvoiceItemProductCard
                                            title={invoiceItem.product.name}
                                            img={invoiceItem.product.img}
                                            sellingPrice={invoiceItem.selling_price}
                                            stockQuantity={invoiceItem.quantity}
                                            maxQuantity={invoiceItem.product.quantity}
                                            onQuantityChange={(quantity, sellingPrice) =>
                                                handleProductQuantityChange(invoiceItem.product, quantity, sellingPrice)
                                            }
                                        />
                                    )}
                                />
                            )
                            : (
                                <View className='mt-3 p-3'>
                                    <Text className='text-lg font-medium text-center'>Products Not Selected</Text>
                                </View>
                            )
                    )
                    : (
                        <FlatList
                            data={filtered}
                            keyExtractor={i => i.product_id.toString()}
                            showsVerticalScrollIndicator={false}
                            className='max-h-120 mt-3'
                            ListEmptyComponent={
                                loading
                                    ? <ActivityIndicator className='my-6' />
                                    : <Text className='text-center text-dark-50 my-6'>No products found</Text>
                            }

                            renderItem={({ item: product }) => (
                                <InvoiceItemProductCard
                                    title={product.name}
                                    img={product.img}
                                    sellingPrice={product.max_selling_price}
                                    stockQuantity={selectedQuantityByProductId[product.product_id] ?? 0}
                                    maxQuantity={product.quantity}
                                    onQuantityChange={(quantity, sellingPrice) =>
                                        handleProductQuantityChange(product, quantity, sellingPrice)
                                    }
                                />
                            )}
                        />
                    )
            }

            <Button
                leftIcon={<IconWrapper name={ICONS.COMMON.updateOutline} />}
                label='DONE'
                onPress={handleDone}
            />

            <Button
                leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                label='CANCEL'
                bgColor='gray'
                onPress={onClose}
            />
        </CustomModal>
    )
}

export default EditInvoiceProductsModal
