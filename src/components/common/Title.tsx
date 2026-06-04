import { Text } from 'react-native';

interface TitleProps {
    text: string;
    fontSize?: "text-2xl" | "text-3xl";
    className?: string;
}

const Title = ({ text, fontSize = "text-3xl", className = "mb-8" }: TitleProps) => {
    return (
        <Text className={`${fontSize} font-semibold text-black text-center` + ` ${className}`}>
            {text}
        </Text>
    );
};

export default Title;