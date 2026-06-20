import ListItemCard from '@/src/components/common/ListItemCard';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import RoundedIconButton from '@/src/components/common/RoundedIconButton';
import SearchFilter from '@/src/components/common/SearchFilter';
import DeleteModal from '@/src/components/modal/DeleteModal';
import { defaultProduct } from '@/src/constants/defaultData';
import { ICONS } from '@/src/constants/icons';
import { handleFilterData } from '@/src/lib/handleFilterData';
import { mockProducts } from '@/src/lib/sampleData';
import { FilterType, ProductType } from '@/src/types/appTypes';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import EditProductModal from './edit-product';
import FilterProductModal from './filter-product';
import ProductDetailModal from './product-detail';

export default function StockScreen() {
    const products: ProductType[] = mockProducts;

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<ProductType>(defaultProduct);
    const [displayedStock, setDisplayedStock] = useState<ProductType[]>(products);
    const [search, setSearch] = useState('');

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

    const handleDelete = () => {
        setIsDeleteModalOpen(false);
        setIsProductDetailModalOpen(false);
    }

    return (
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>
                <PaddingWrapper addPaddingBottom={false}>

                    <SearchFilter
                        value={search}
                        onChangeText={setSearch}
                        onFilterPress={() => setIsFilterModalOpen(true)}
                    />

                    <FlatList
                        data={filtered}
                        // Fixed: product_id is a number; converted to string to meet native key guidelines
                        keyExtractor={(item) => item.product_id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
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

            <RoundedIconButton />


            {/* MODALS */}

            {isFilterModalOpen && (
                <FilterProductModal
                    visible={isFilterModalOpen}
                    onApplyFilters={onApplyFilters}
                    onClose={() => setIsFilterModalOpen(false)}
                />
            )}

            {isProductDetailModalOpen && (
                <ProductDetailModal
                    item={selectedItem}
                    visible={isProductDetailModalOpen}
                    onClose={() => setIsProductDetailModalOpen(false)}
                    onRemove={() => setIsDeleteModalOpen(true)}
                    onEdit={() => setIsEditProductModalOpen(true)}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    title='Remove Product'
                    subtitle='You are going to remove below product'
                    removeItem={selectedItem.name}
                    isVisible={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDelete}
                />
            )}

            {isEditProductModalOpen && (
                <EditProductModal
                    product={selectedItem}
                    visible={isEditProductModalOpen}
                    onClose={() => setIsEditProductModalOpen(false)}
                />
            )}
        </View>
    );
}