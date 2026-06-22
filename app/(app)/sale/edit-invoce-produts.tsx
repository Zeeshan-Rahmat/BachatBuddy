import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InternalTabBar from '@/src/components/common/InternalTabBar';
import SearchFilter from '@/src/components/common/SearchFilter';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import InvoiceItemProductCard from '@/src/components/ui/InvoiceItemProductCard';
import { ICONS } from '@/src/constants/icons';
import { mockProducts } from '@/src/lib/sampleData';
import { InvoiceItemType, ProductType } from '@/src/types/appTypes';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';

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

    const products = mockProducts;

    const [selectedProductsUpdate, setSelectedProductsUpdate] = useState(selectedProducts);
    const [activeTab, setActiveTab] = useState('Selected Products');

    const [search, setSearch] = useState('');

    const filtered = products.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectedProduct = (supplier: ProductType) => {

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
                        selectedProducts
                            ? (
                                <View className='mt-3 p-3'>
                                    <Text className='text-lg font-medium text-center'>Selected Products</Text>
                                </View>
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

                            renderItem={({ item: product }) => (
                                <InvoiceItemProductCard
                                    title={product.name}
                                    img={product.img}
                                    sellingPrice={product.max_selling_price}
                                />
                            )}
                        />
                    )
            }

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