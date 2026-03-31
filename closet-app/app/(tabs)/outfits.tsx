import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useClosetStore } from "../../store/closetStore";
import OutfitCard from "../../components/OutfitCard";
import OutfitBuilderModal from "../../components/OutfitBuilderModal";
import type { Outfit } from "../../types";
import { generateId } from "../../lib/utils";
import { saveOutfit, deleteOutfit } from "../../lib/database";

export default function OutfitsScreen() {
  const { outfits, items, addOutfit, removeOutfit } = useClosetStore();
  const [builderVisible, setBuilderVisible] = useState(false);

  async function handleSaveOutfit(name: string, itemIds: string[]) {
    const outfit: Outfit = {
      id: generateId(),
      name,
      itemIds,
      createdAt: Date.now(),
    };
    addOutfit(outfit);
    await saveOutfit(outfit);
    setBuilderVisible(false);
  }

  function handleDelete(id: string) {
    Alert.alert("Delete outfit?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          removeOutfit(id);
          await deleteOutfit(id);
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary px-4 pt-2 pb-4 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Outfits</Text>
        <TouchableOpacity
          onPress={() => setBuilderVisible(true)}
          className="bg-accent rounded-full w-10 h-10 items-center justify-center"
          disabled={items.length === 0}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Ionicons name="shirt-outline" size={64} color="#e5e7eb" />
          <Text className="text-muted text-base text-center px-8">
            Add some clothes to your closet first, then build outfits here.
          </Text>
        </View>
      ) : outfits.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Ionicons name="layers-outline" size={64} color="#e5e7eb" />
          <Text className="text-muted text-base">No outfits yet.</Text>
          <TouchableOpacity
            onPress={() => setBuilderVisible(true)}
            className="bg-accent px-5 py-2.5 rounded-xl mt-1"
          >
            <Text className="text-white font-semibold">Create first outfit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={outfits}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: 12, gap: 12 }}
          renderItem={({ item }) => (
            <OutfitCard
              outfit={item}
              clothingItems={items}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      <OutfitBuilderModal
        visible={builderVisible}
        items={items}
        onClose={() => setBuilderVisible(false)}
        onSave={handleSaveOutfit}
      />
    </SafeAreaView>
  );
}
