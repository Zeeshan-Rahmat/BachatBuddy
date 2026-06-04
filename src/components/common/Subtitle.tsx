import { Text } from 'react-native';

interface SubtitleProps {
    text: string;
    fontSize?: "text-base" | "text-lg";
    className?: string;
}

const Subtitle = ({ text, fontSize = "text-base", className = "mb-6" }: SubtitleProps) => {
    return (
        <Text className={`${fontSize} text-dark-50 text-center leading-5` + ` ${className}`}>
            {text}
        </Text>
    );
};

export default Subtitle;