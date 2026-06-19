import React from 'react';
import { Image, View, type ImageSourcePropType } from 'react-native';
import IconWrapper from './IconWrapper';

interface ImageContainerProps {
    placeholder: ImageSourcePropType;
    image?: ImageSourcePropType;
    size?: number; // Default 64
    iconSize?: number; // Default 30
    border?: number;
}

const ImageContainer = ({ placeholder, image, size = 64, iconSize = 30, border }: ImageContainerProps) => {
    return (
        <View className="rounded-button border border-light-100 mr-3 items-center justify-center" style={{ width: size, height: size, borderWidth: border }}>
            {
                image ? (
                    <Image source={image} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <IconWrapper name={placeholder} size={iconSize} />
                )
            }
        </View>
    )
}

export default ImageContainer