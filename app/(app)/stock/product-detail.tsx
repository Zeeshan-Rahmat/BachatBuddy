import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import ImageContainer from '@/src/components/common/ImageContainer';
import Title from '@/src/components/common/Title';
import CustomModal from '@/src/components/modal/CustomModal';
import CloseButton from '@/src/components/ui/CloseButton';
import DetailsText from '@/src/components/ui/DetailsText';
import { ICONS } from '@/src/constants/icons';
import { ProductType } from '@/src/types/appTypes';
import { formatDateTime } from '@/src/Utility/DateFunctions';
import { getStatusColor } from '@/src/Utility/getStatusColor';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProductDetailModalProps {
    item: ProductType;
    visible: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onRemove?: () => void;
}

export default function ProductDetailModal({ item, visible, onClose, onEdit, onRemove }: ProductDetailModalProps) {
    const [showDetail, setShowDetail] = useState(false);

    const statusColors = getStatusColor(item.status);

    return (
        <CustomModal visible={visible}>

            <View className="rounded-button items-center justify-center bg-light-300 border border-light-100 py-4 relative">
                <CloseButton onClose={onClose} />

                <ImageContainer
                    placeholder={ICONS.COMMON.product}
                    image={item.img ? { uri: item.img } : undefined}
                    size={150}
                    iconSize={70}
                    border={0}
                />
            </View>


            <View className="mt-4 px-1">
                <Title text={item.name ?? "Item Name"} fontSize='text-2xl' className='text-left my-2' />

                <TouchableOpacity
                    onPress={() => setShowDetail(!showDetail)}
                    activeOpacity={0.7}
                    className="gap-1"
                >

                    <DetailsText label='Supplier:' value={item.supplier.name} />
                    <DetailsText label='Last Updated by' value={item.last_updated_by.name} />
                    {
                        showDetail &&
                        <>
                            <DetailsText label='Last Updated at' value={formatDateTime(item.last_updated_at)} />
                            <DetailsText label='Created by' value={item.created_by.name} />
                            <DetailsText label='Created at' value={formatDateTime(item.created_at)} />
                        </>
                    }

                </TouchableOpacity>


                <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-lg font-bold text-navy-400">
                        {item.quantity} <Text className="text-base font-semibold text-dark-300">in Stock</Text>
                    </Text>

                    <View className={`ml-auto px-2.5 py-1 rounded-button ${statusColors.bg}`}>
                        <Text className={`text-xs font-semibold ${statusColors.text}`}>{item.status}</Text>
                    </View>
                </View>
            </View>


            <View className="flex-row justify-between items-center mt-6 mb-8">

                <AmountCard amount={item.max_selling_price ?? 400} label='Max Selling Price' />

                <View className='w-px h-full bg-light-100' />

                <AmountCard amount={item.min_selling_price ?? 300} label='Min Selling Price' />

                <View className='w-px h-full bg-light-100' />

                <AmountCard amount={item.purchase_price ?? 250} label='Purchase Price' />

            </View>


            {/* Buttons */}
            <View className='flex-row gap-4 mt-2'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.deleteWhite} />}
                    label='REMOVE'
                    bgColor='red'
                    width='flex-1'
                    onPress={onRemove}
                />

                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.editWhite} />}
                    label='EDIT'
                    width='flex-1'
                    onPress={onEdit}
                />
            </View>

        </CustomModal>
    );
}

function AmountCard({ amount, label }: { amount: number, label: string }) {
    return (
        <View className="flex-1 min-w-1/5 justify-center items-center">
            <Text className="text-xl font-bold text-navy-400">{amount.toLocaleString()}</Text>
            <Text className="text-[10px] font-semibold text-dark-50 mt-0.5 tracking-wide">
                {label}
            </Text>
        </View>
    )
}