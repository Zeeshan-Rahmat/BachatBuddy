import React from 'react'
import { View, type ImageSourcePropType } from 'react-native'
import IconWrapper from './IconWrapper'

interface ImageContainerProps {
    placeholder: ImageSourcePropType
}

const ImageContainer = ({ placeholder }: ImageContainerProps) => {
    return (
        <View className="w-18 h-18 rounded-button border border-light-100 mr-3 items-center justify-center">
            <IconWrapper name={placeholder} size={30} />
        </View>
    )
}

export default ImageContainer