import { Image, type ImageSourcePropType, type ImageStyle } from 'react-native';

interface IconWrapperProps {
    name: ImageSourcePropType;
    size?: number;
    className?: string;
}

const IconWrapper = ({ name, size = 24, className = "" }: IconWrapperProps) => {
    return (
        <Image
            source={name}
            className={className}
            style={{ width: size, height: size } as ImageStyle}
            resizeMode="contain"
        />
    );
};

export default IconWrapper;