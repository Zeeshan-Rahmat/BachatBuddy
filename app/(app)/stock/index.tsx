import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import DeleteModal from '@/src/components/modal/DeleteModal';
import { defaultProduct } from '@/src/constants/defaultData';
import { ICONS } from '@/src/constants/icons';
import { listProductsWithRelations, markProductPendingDelete } from '@/src/db/repositories/productsRepository';
import { mapProductRowToAppProduct } from '@/src/services/inventory/productUiMapper';
import { useAuthStore } from '@/src/store/authStore';
import { FilterType, ProductType } from '@/src/types/appTypes';
import { handleFilterData } from '@/src/Utility/handleFilterData';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import AddProductManualModal from './add-product-manual';
import EditProductModal from './edit-product';
import FilterProductModal from './filter-product';
import ProductDetailModal from './product-detail';

export default function StockScreen() {
    const requiresApproval = useAuthStore((state) => state.requiresApproval);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<ProductType>(defaultProduct);
    const [displayedStock, setDisplayedStock] = useState<ProductType[]>([]);
    const [search, setSearch] = useState('');

    const loadProducts = useCallback(async () => {
        setLoading(true);

        try {
            const rows = await listProductsWithRelations();
            const mappedProducts = rows.map(mapProductRowToAppProduct);
            setProducts(mappedProducts);
            setDisplayedStock(mappedProducts);
        } catch {
            Alert.alert('Load failed', 'Unable to load products from local storage.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadProducts();
        }, [loadProducts])
    );

    // Combine stateful multi-category modal filters with local text queries smoothly
    const filtered = displayedStock.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const onApplyFilters = (filters: FilterType) => {
        // Run advanced filtering logic safely over typed multi-entity datasets
        const output = handleFilterData(filters, products);

        // Update local list layouts and hide selection screen
        setDisplayedStock(output as ProductType[]);
        setIsFilterModalOpen(false);
    };

    const handleDelete = async () => {
        const deleted = await markProductPendingDelete(selectedItem.product_id, requiresApproval());

        if (!deleted) {
            Alert.alert('Remove failed', 'This product could not be found in local storage.');
            return;
        }

        setIsDeleteModalOpen(false);
        setIsProductDetailModalOpen(false);
        await loadProducts();
    }

    const handleProductSaved = async () => {
        setIsEditProductModalOpen(false);
        setIsProductDetailModalOpen(false);
        await loadProducts();
    }

    return (
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>
                <PaddingWrapper addPaddingBottom={false}>

                    <SearchFilter
                        value={search}
                        searchPlaceholder="Search Products"
                        onChangeText={setSearch}
                        onFilterPress={() => setIsFilterModalOpen(true)}
                    />

                    <FlatList
                        data={filtered}

                        keyExtractor={(item) => item.product_id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProducts} />}
                        ListEmptyComponent={
                            loading
                                ? <ActivityIndicator className='my-8' />
                                : <Text className='text-center text-dark-50 my-8'>No products found</Text>
                        }
                        renderItem={({ item }) => (
                            <ListItemCard
                                item={item}
                                placeholder={ICONS.COMMON.product}
                                isProduct={true}
                                onPress={() => {
                                    setSelectedItem(item);
                                    setIsProductDetailModalOpen(true);
                                }}
                            />
                        )}
                    />

                </PaddingWrapper>
            </ScreenWrapper>

            <RoundedIconButton onPress={() => setIsAddProductModalOpen(true)} />


            {/* MODALS */}

            {
                isFilterModalOpen && (
                    <FilterProductModal
                        visible={isFilterModalOpen}
                        onApplyFilters={onApplyFilters}
                        onClose={() => setIsFilterModalOpen(false)}
                    />
                )
            }

            {
                isProductDetailModalOpen && (
                    <ProductDetailModal
                        item={selectedItem}
                        visible={isProductDetailModalOpen}
                        onClose={() => setIsProductDetailModalOpen(false)}
                        onRemove={() => setIsDeleteModalOpen(true)}
                        onEdit={() => setIsEditProductModalOpen(true)}
                    />
                )
            }

            {
                isDeleteModalOpen && (
                    <DeleteModal
                        title='Remove Product'
                        subtitle='You are going to remove below product'
                        removeItem={selectedItem.name}
                        isVisible={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onDelete={handleDelete}
                    />
                )
            }

            {
                isEditProductModalOpen && (
                    <EditProductModal
                        product={selectedItem}
                        visible={isEditProductModalOpen}
                        onClose={() => setIsEditProductModalOpen(false)}
                        onSaved={handleProductSaved}
                    />
                )
            }

            {
                isAddProductModalOpen &&
                <AddProductManualModal
                    visible={isAddProductModalOpen}
                    onClose={() => setIsAddProductModalOpen(false)}
                    onSaved={handleProductSaved}
                />
            }
        </View>
    );
}
