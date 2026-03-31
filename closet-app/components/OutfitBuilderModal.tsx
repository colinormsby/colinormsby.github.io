import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ClothingItem } from "../types";
import { CATEGORIES } from "../lib/utils";
import ClothingCard from "./ClothingCard";
import CategoryPill from "./CategoryPill";

interface Props {
  visible: boolean;
  items: ClothingItem[];
  onClose: () => void;
  onSave: (name: string, itemIds: string[]) => void;
}

export default function OutfitBuilderModal({ visible, items, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Name required", "Give your outfit a name.");
      return;
    }
    if (selectedIds.size === 0) {
      Alert.alert("No items", "Select at least one item for this outfit.");
      return;
    }
    onSave(name.trim(), Array.from(selectedIds));
    setName("");
    setSelectedIds(new Set());
    setFilterCategory("all");
  }

  function handleClose() {
    setName("");
    setSelectedIds(new Set());
    setFilterCategory("all");
    onClose();
  }

  const filtered =
    filterCategory === "all"
      ? items
      : items.filter((i) => i.category === filterCategory);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView className="flex-1 bg-surface">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          {/* Header */}
          <View className="bg-primary px-4 py-3 flex-row items-center justify-between">
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Build Outfit</Text>
            <TouchableOpacity onPress={handleSave} className="bg-accent px-4 py-1.5 rounded-xl">
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>

          {/* Name input */}
          <View className="px-4 py-3 bg-white border-b border-gray-100">
            <TextInput
              className="text-primary text-base font-medium"
              placeholder="Outfit name…"
              value={name}
              onChangeText={setName}
              returnKeyType="done"
            />
          </View>

          {/* Selected count banner */}
          {selectedIds.size > 0 && (
            <View className="bg-accent/10 px-4 py-2 flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={16} color="#e94560" />
              <Text className="text-accent font-medium text-sm">
                {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""} selected
              </Text>
            </View>
          )}

          {/* Category filter */}
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(c) => c.value}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
            renderItem={({ item }) => (
              <CategoryPill
                label={item.label}
                value={item.value as any}
                active={filterCategory === item.value}
                onPress={() => setFilterCategory(item.value)}
              />
            )}
          />

          {/* Item grid */}
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            numColumns={3}
            contentContainerStyle={{ padding: 8 }}
            columnWrapperStyle={{ gap: 6 }}
            ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
            renderItem={({ item }) => (
              <ClothingCard
                item={item}
                onPress={() => toggleItem(item.id)}
                selected={selectedIds.has(item.id)}
                onSelect={() => toggleItem(item.id)}
              />
            )}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
