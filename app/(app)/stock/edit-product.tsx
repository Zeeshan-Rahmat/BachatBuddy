import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import ListItemCard from '@/src/components/common/ListItemCard';
import Title from '@/src/components/common/Title';
import CustomeModal from '@/src/components/modal/CustomModal';
import IconButton from '@/src/components/ui/IconButton';
import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import { updateProduct } from '@/src/db/repositories/productsRepository';
import { useAuthStore } from '@/src/store/authStore';
import { ProductType, SupplierType } from '@/src/types/appTypes';
import ProfilePicker from '@components/form/ProfilePicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AddProductSupplierModal from './add-product-supplier';

interface EditProductModalProps {
    product: ProductType;
    visible: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

const EditProductModal = ({ product, visible, onClose, onSaved }: EditProductModalProps) => {
    const currentUser = useAuthStore((state) => state.user);
    const requiresApproval = useAuthStore((state) => state.requiresApproval);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);


    const [selectedSupplier, setSelectedSupplier] = useState<SupplierType | undefined>(
        product.supplier.supplier_id ? product.supplier : undefined
    );

    const [productName, setProductName] = useState(product.name);
    const [stock, setStock] = useState(product.quantity.toString());
    const [minStock, setMinStock] = useState(product.minimum_quantity.toString());
    const [purchasePrice, setPurchasePrice] = useState(product.purchase_price.toString());
    const [maxSellingPrice, setMaxSellingPrice] = useState(product.max_selling_price.toString());
    const [minSellingPrice, setMinSellingPrice] = useState(product.min_selling_price.toString());
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        productName: '', stock: '', minStock: '', purchasePrice: '', maxSellingPrice: '', minSellingPrice: '',
    });

    const [imageUri, setImageUri] = useState<string | null>(product.img ?? null);
    const [imageError, setImageError] = useState<string | undefined>(undefined);

    const validate = () => {
        const e = { productName: '', stock: '', minStock: '', purchasePrice: '', maxSellingPrice: '', minSellingPrice: '', };
        let valid = true;
        const numericFields = [
            { value: stock, key: 'stock' as const, label: 'Stock' },
            { value: minStock, key: 'minStock' as const, label: 'Minimum Stock' },
            { value: purchasePrice, key: 'purchasePrice' as const, label: 'Purchase Price' },
            { value: maxSellingPrice, key: 'maxSellingPrice' as const, label: 'Maximum Selling Price' },
            { value: minSellingPrice, key: 'minSellingPrice' as const, label: 'Minimum Selling Price' },
        ];

        if (!productName.trim()) { e.productName = 'Product Name is required'; valid = false; }

        numericFields.forEach(({ value, key, label }) => {
            const parsedValue = Number(value);

            if (value.trim() === '') {
                e[key] = `${label} is required`;
                valid = false;
                return;
            }

            if (!Number.isFinite(parsedValue) || parsedValue < 0) {
                e[key] = `${label} must be a valid number`;
                valid = false;
            }
        });

        setErrors(e);
        return valid;
    };

    // This function asks for permission and opens the image gallery
    const handlePickImage = async () => {
        setImageError(undefined); // Reset errors

        // Request media library permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow access to your photos to upload a profile picture.");
            return;
        }

        // Launch the photo gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Shows standard cropping square box
            aspect: [1, 1],      // Forces a 1:1 square crop ratio
            quality: 0.8,        // Compresses image slightly for faster uploads
        });

        // Save image URI if user did not cancel
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const onStockAdd = () => {
        setStock((prev) => (parseInt(prev) + 1).toString())
    }

    const onStockMinus = () => {
        setStock((prev) => (Math.max(0, parseInt(prev) - 1)).toString());
    };

    const onMinStockAdd = () => {
        setMinStock((prev) => (parseInt(prev) + 1).toString())
    }

    const onMinStockMinus = () => {
        setMinStock((prev) => (Math.max(0, parseInt(prev) - 1)).toString());
    };

    const onPressSupplier = () => {
        // onPressSupplier
        setIsSupplierModalOpen(true)
    };

    const handleUpdate = async () => {
        if (!validate()) return;
        setLoading(true);

        try {
            await updateProduct(product.product_id, {
                lastUpdatedById: currentUser?.id ?? null,
                supplierId: selectedSupplier?.supplier_id || null,
                name: productName.trim(),
                purchasePrice: Number(purchasePrice),
                minSellingPrice: Number(minSellingPrice),
                maxSellingPrice: Number(maxSellingPrice),
                quantity: Number(stock),
                minimumQuantity: Number(minStock),
                img: imageUri,
                requiresApproval: requiresApproval(),
            });

            onSaved?.();
            onClose();
        } catch {
            Alert.alert('Update failed', 'Unable to update this product locally. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CustomeModal visible={visible}>
                <Title text='Edit Product' />

                <ScrollView
                    className="max-h-130 py-4"
                    showsVerticalScrollIndicator={false}
                >
                    <InputText
                        icon={<IconWrapper name={ICONS.STOCK.productBox} />}
                        activeIcon={<IconWrapper name={ICONS.STOCK.activeProductBox} />}
                        placeholder="Product Name"
                        value={productName}
                        onChangeText={(t) => { setProductName(t); setErrors(e => ({ ...e, productName: '' })); }}
                        error={errors.productName}
                    />

                    <View className='flex-row gap-4'>
                        <InputText
                            flex={1}
                            icon={<IconWrapper name={ICONS.STOCK.warehouse} />}
                            activeIcon={<IconWrapper name={ICONS.STOCK.activeWarehouse} />}
                            placeholder="Stock Quantity"
                            value={stock}
                            onChangeText={(t) => { setStock(t); setErrors(e => ({ ...e, stock: '' })); }}
                            error={errors.stock}
                            keyboardType='numeric'
                        />

                        <IconButton
                            icon={<IconWrapper name={ICONS.STOCK.minus} />}
                            bgColor={COLORS.danger}
                            onPress={onStockMinus}
                        />
                        <IconButton
                            icon={<IconWrapper name={ICONS.COMMON.plus} />}
                            onPress={onStockAdd}
                        />
                    </View>

                    <View className='flex-row gap-4'>
                        <InputText
                            flex={1}
                            icon={<IconWrapper name={ICONS.STOCK.warehouse} />}
                            activeIcon={<IconWrapper name={ICONS.STOCK.activeWarehouse} />}
                            placeholder="Minimum Stock Quantity"
                            value={minStock}
                            onChangeText={(t) => { setMinStock(t); setErrors(e => ({ ...e, minStock: '' })); }}
                            error={errors.minStock}
                            keyboardType='numeric'
                        />

                        <IconButton
                            icon={<IconWrapper name={ICONS.STOCK.minus} />}
                            bgColor={COLORS.danger}
                            onPress={onMinStockMinus}
                        />
                        <IconButton
                            icon={<IconWrapper name={ICONS.COMMON.plus} />}
                            onPress={onMinStockAdd}
                        />
                    </View>

                    <InputText
                        icon={<IconWrapper name={ICONS.STOCK.purchaseMoney} />}
                        activeIcon={<IconWrapper name={ICONS.STOCK.activePurchaseMoney} />}
                        placeholder="Purchase Price"
                        value={purchasePrice}
                        onChangeText={(t) => { setPurchasePrice(t); setErrors(e => ({ ...e, purchasePrice: '' })); }}
                        error={errors.purchasePrice}
                        keyboardType='numeric'
                    />


                    <InputText
                        icon={<IconWrapper name={ICONS.STOCK.sellingMoney} />}
                        activeIcon={<IconWrapper name={ICONS.STOCK.activeSellingMoney} />}
                        placeholder="Minimum Selling Price"
                        value={minSellingPrice}
                        onChangeText={(t) => { setMinSellingPrice(t); setErrors(e => ({ ...e, minSellingPrice: '' })); }}
                        error={errors.minSellingPrice}
                        keyboardType='numeric'
                    />


                    <InputText
                        icon={<IconWrapper name={ICONS.STOCK.sellingMoney} />}
                        activeIcon={<IconWrapper name={ICONS.STOCK.activeSellingMoney} />}
                        placeholder="Maximum Selling Price"
                        value={maxSellingPrice}
                        onChangeText={(t) => { setMaxSellingPrice(t); setErrors(e => ({ ...e, maxSellingPrice: '' })); }}
                        error={errors.maxSellingPrice}
                        keyboardType='numeric'
                    />

                    <View className='min-h-16 justify-center items-center border border-light-100 rounded-button mb-4'>
                        {
                            selectedSupplier
                                ? (
                                    <ListItemCard
                                        item={selectedSupplier}
                                        placeholder={ICONS.COMMON.customer}
                                        isParty={true}
                                        onPress={onPressSupplier}
                                    />
                                )
                                : (
                                    <TouchableOpacity
                                        onPress={onPressSupplier}
                                        activeOpacity={0.7}
                                        className="flex-row items-center justify-center border border-dashed border-primary-400/30 bg-primary-400/10 px-5 py-2.5 rounded-button"
                                    >
                                        <MaterialCommunityIcons name="plus" size={18} color={COLORS.primary500} />
                                        <Text className="text-primary-500 text-sm font-bold ml-1">
                                            Add Supplier
                                        </Text>
                                    </TouchableOpacity>
                                )
                        }
                    </View>

                    <ProfilePicker
                        imageUri={imageUri}
                        onPickImage={handlePickImage}
                        error={imageError}
                        icon={<IconWrapper name={ICONS.COMMON.addImage} />}
                        activeIcon={<IconWrapper name={ICONS.COMMON.activeAddImage} />}
                        rightIcon={<IconWrapper name={ICONS.COMMON.camera} />}
                        activeRightIcon={<IconWrapper name={ICONS.AUTH.largeVerified} />}
                    />
                </ScrollView>

                <View className='flex-row mt-3 gap-4'>
                    <Button
                        leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                        label='CANCEL'
                        bgColor='gray'
                        width='flex-1'
                        onPress={onClose}
                    />

                    <Button
                        leftIcon={<IconWrapper name={ICONS.COMMON.updateOutline} />}
                        label='UPDATE'
                        width='flex-1'
                        loading={loading}
                        onPress={handleUpdate}
                    />
                </View>
            </CustomeModal>

            {
                isSupplierModalOpen &&
                <AddProductSupplierModal
                    visible={isSupplierModalOpen}
                    selectedSupplier={selectedSupplier}
                    onClose={() => setIsSupplierModalOpen(false)}
                    setSelectedSupplier={setSelectedSupplier}
                />
            }
        </>
    )
}

export default EditProductModal
