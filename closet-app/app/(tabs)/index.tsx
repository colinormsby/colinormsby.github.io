import { View, Text, TextInput, TouchableOpacity, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClosetStore } from "../../store/closetStore";
import { CATEGORIES } from "../../lib/utils";
import ClothingCard from "../../components/ClothingCard";
import CategoryPill from "../../components/CategoryPill";

export default function ClosetScreen() {
  const router = useRouter();
  const {
    selectedCategory,
    setCategory,
    searchQuery,
    setSearchQuery,
    filteredItems,
  } = useClosetStore();

  const items = filteredItems();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary px-4 pt-2 pb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-2xl font-bold">My Closet</Text>
          <TouchableOpacity
            onPress={() => router.push("/add-item")}
            className="bg-accent rounded-full w-10 h-10 items-center justify-center"
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white/10 rounded-xl px-3 py-2">
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-white"
            placeholder="Search by name, color, brand…"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category pills */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
        renderItem={({ item }) => (
          <CategoryPill
            label={item.label}
            value={item.value}
            active={selectedCategory === item.value}
            onPress={() => setCategory(item.value as any)}
          />
        )}
      />

      {/* Grid */}
      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Ionicons name="shirt-outline" size={64} color="#e5e7eb" />
          <Text className="text-muted text-base">
            {searchQuery ? "No results found." : "Your closet is empty!"}
          </Text>
          {!searchQuery && (
            <TouchableOpacity
              onPress={() => router.push("/add-item")}
              className="bg-accent px-5 py-2.5 rounded-xl mt-1"
            >
              <Text className="text-white font-semibold">Add first item</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          columnWrapperStyle={{ gap: 8 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <ClothingCard
              item={item}
              onPress={() => router.push(`/item/${item.id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
