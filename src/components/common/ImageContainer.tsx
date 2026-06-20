import React, { useEffect, useState } from 'react';
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
    const [hasError, setHasError] = useState(false);

    // Reset error state if the image source prop changes dynamically
    useEffect(() => {
        setHasError(false);
    }, [image]);

    // Safety check: Is there a valid URI string inside the image source object?
    const isImageSourceValid = () => {
        if (!image) return false;
        // If it's a network URI object like { uri: '' }, check if the string itself is empty
        if (typeof image === 'object' && 'uri' in image) {
            return typeof image.uri === 'string' && image.uri.trim() !== '';
        }
        return true; // For local require() resource tracking numbers
    };

    const shouldShowImage = isImageSourceValid() && !hasError;

    return (
        <View
            className="rounded-button overflow-hidden border border-light-100 mr-3 items-center justify-center"
            style={{ width: size, height: size, borderWidth: border }}
        >
            {shouldShowImage ? (
                <Image
                    source={image}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={() => setHasError(true)} // Triggers placeholder fallback if download links error out
                />
            ) : (
                <IconWrapper name={placeholder} size={iconSize} />
            )}
        </View>
    );
};

export default ImageContainer;