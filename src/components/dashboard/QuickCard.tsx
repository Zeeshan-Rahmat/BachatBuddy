import IconWithBackground from '@components/dashboard/IconWithBackground';
import React from 'react';
import { Text, TouchableOpacity, type ImageSourcePropType } from 'react-native';

interface QuickCardProps {
  icon: ImageSourcePropType;
  label: string
  minWidth?: "min-w-[22%]" | "min-w-[30%]"; // Default 22%
  flex?: boolean;
}

const QuickCard = ({ icon, label, minWidth = "min-w-[22%]", flex = true }: QuickCardProps) => {
  return (
    <TouchableOpacity className={`bg-white rounded-button items-center justify-center py-4 
      ${minWidth == "min-w-[22%]" ? "flex-1 min-w-[22%]" : minWidth}
      `}
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
      <IconWithBackground icon={icon} />
      <Text className="text-black text-xs text-center font-medium">{label}</Text>
    </TouchableOpacity>
  )
}

export default QuickCard