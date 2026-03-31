import { View, Text, Image, TouchableOpacity } from "react-native";
import type { ClothingItem } from "../types";

interface Props {
  item: ClothingItem;
  onPress: () => void;
  selected?: boolean;
  onSelect?: () => void;
}

export default function ClothingCard({ item, onPress, selected, onSelect }: Props) {
  const handlePress = onSelect ?? onPress;

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`flex-1 rounded-2xl overflow-hidden bg-white shadow-sm border-2 ${
        selected ? "border-accent" : "border-transparent"
      }`}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.imageUri }}
        className="w-full h-44"
        resizeMode="contain"
        style={{ backgroundColor: "#f9fafb" }}
      />
      <View className="p-2">
        <Text className="text-primary font-semibold text-sm" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-muted text-xs capitalize">{item.category}</Text>
      </View>
      {selected && (
        <View className="absolute top-2 right-2 bg-accent rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-white text-xs font-bold">✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
