import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ClothingItem, Outfit } from "../types";

interface Props {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  onDelete: () => void;
}

export default function OutfitCard({ outfit, clothingItems, onDelete }: Props) {
  const items = outfit.itemIds
    .map((id) => clothingItems.find((i) => i.id === id))
    .filter(Boolean) as ClothingItem[];

  return (
    <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-primary font-bold text-base">{outfit.name}</Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-muted text-xs">{items.length} items</Text>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color="#e94560" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Item thumbnails */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, gap: 8 }}
      >
        {items.length === 0 ? (
          <Text className="text-muted text-sm py-4">No items in this outfit.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} className="items-center gap-1">
              <Image
                source={{ uri: item.imageUri }}
                className="w-20 h-24 rounded-xl"
                resizeMode="contain"
                style={{ backgroundColor: "#f9fafb" }}
              />
              <Text className="text-xs text-muted w-20 text-center" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {outfit.lastWorn && (
        <View className="px-4 pb-3">
          <Text className="text-muted text-xs">
            Last worn: {new Date(outfit.lastWorn).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );
}
