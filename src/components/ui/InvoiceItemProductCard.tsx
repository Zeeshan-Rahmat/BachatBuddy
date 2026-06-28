import { ICONS } from '@/src/constants/icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { ImageSourcePropType, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImageContainer from '../common/ImageContainer';

interface InvoiceItemProductCardProps {
    title: string;
    img?: ImageSourcePropType | string;
    stockQuantity?: number;
    sellingPrice: number;
    maxQuantity?: number;
    onQuantityChange?: (quantity: number, sellingPrice: number) => void;
}

const InvoiceItemProductCard = ({
    title,
    img,
    stockQuantity = 0,
    sellingPrice,
    maxQuantity,
    onQuantityChange,
}: InvoiceItemProductCardProps
) => {

    const imageSource = typeof img === 'string' ? { uri: img } : img;

    const [quantity, setQuantity] = useState(stockQuantity)
    const [updatedSellingPrice, setUpdatedSellingPrice] = useState(sellingPrice.toString())
    const [totalAmount, setTotalAmount] = useState(quantity * parseFloat(updatedSellingPrice))

    const [showInput, setShowInput] = useState(false)

    const onQuantityAdd = () => {
        const newQuantity = maxQuantity === undefined ? quantity + 1 : Math.min(maxQuantity, quantity + 1);

        setQuantity(newQuantity);
        setTotalAmount(newQuantity * parseFloat(updatedSellingPrice));
        onQuantityChange?.(newQuantity, parseFloat(updatedSellingPrice) || 0);
    }

    const onQuantityMinus = () => {
        const newQuantity = Math.max(0, quantity - 1);

        setQuantity(newQuantity);
        setTotalAmount(newQuantity * parseFloat(updatedSellingPrice));
        onQuantityChange?.(newQuantity, parseFloat(updatedSellingPrice) || 0);
    };

    const handleSellingPriceDone = () => {
        const parsedSellingPrice = parseFloat(updatedSellingPrice) || 0;

        setTotalAmount(quantity * parsedSellingPrice);
        setShowInput(false);
        onQuantityChange?.(quantity, parsedSellingPrice);
    };

    return (
        <View
            className="bg-white rounded-button flex-row items-center "
        >

            <ImageContainer
                placeholder={ICONS.COMMON.product}
                image={imageSource}
                size={48}
                iconSize={28}
            />

            <View className="flex-1 py-5 border-b border-light-100">
                {
                    showInput
                        ? (
                            <View className='flex-row gap-3 items-center'>
                                <TextInput
                                    className="flex-1 text-black text-base bg-light-300 outline-none pl-5 pr-2  rounded-inputBox"
                                    value={updatedSellingPrice}
                                    onChangeText={(val) => setUpdatedSellingPrice(val)}
                                    placeholder="Enter Selling Price"
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={handleSellingPriceDone}
                                    className="w-12 aspect-square rounded-button items-center justify-center bg-primary-400"
                                >
                                    <MaterialIcons name="done" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                        )
                        : (
                            <>
                                <Text className="text-black font-bold text-base mb-1">{title}</Text>

                                <View className="flex-row justify-between">
                                    <TouchableOpacity onPress={() => setShowInput(true)}>
                                        <Text className='text-dark-100 text-sm'>
                                            {updatedSellingPrice.toLocaleString()} PKR
                                            <Text className='text-navy-400 text-base'> | </Text>
                                            <Text className='font-semibold'>{(totalAmount).toLocaleString()} PKR</Text>
                                        </Text>
                                    </TouchableOpacity>

                                    <View className='flex-row gap-3'>
                                        <TouchableOpacity
                                            onPress={onQuantityMinus}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            className='bg-danger w-8 h-6 justify-center items-center rounded-button'
                                        >
                                            <FontAwesome6 name="minus" size={12} color="white" />
                                        </TouchableOpacity>

                                        <Text className='text-dark-100 text-base font-semibold'>
                                            {quantity}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={onQuantityAdd}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            className='bg-success w-8 h-6 justify-center items-center rounded-button'
                                        >
                                            <FontAwesome6 name="plus" size={12} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )
                }
            </View>

        </View>
    )
}

export default InvoiceItemProductCard
