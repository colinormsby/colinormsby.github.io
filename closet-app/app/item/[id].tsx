import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClosetStore } from "../../store/closetStore";
import { deleteItem } from "../../lib/database";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, removeItem } = useClosetStore();

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted">Item not found.</Text>
      </View>
    );
  }

  function handleDelete() {
    Alert.alert("Remove item?", "This will also remove it from all outfits.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          removeItem(item!.id);
          await deleteItem(item!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Photo */}
        <Image
          source={{ uri: item.imageUri }}
          className="w-full h-96"
          resizeMode="contain"
          style={{ backgroundColor: "#f3f4f6" }}
        />

        <View className="px-4 mt-4 gap-4">
          {/* Name + category */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-primary">{item.name}</Text>
              <Text className="text-muted capitalize mt-0.5">{item.category}</Text>
            </View>
            <TouchableOpacity
              onPress={handleDelete}
              className="p-2"
            >
              <Ionicons name="trash-outline" size={22} color="#e94560" />
            </TouchableOpacity>
          </View>

          {/* Details card */}
          <View className="bg-white rounded-2xl p-4 shadow-sm gap-3">
            {item.color ? (
              <Row icon="color-palette-outline" label="Color" value={item.color} />
            ) : null}
            {item.brand ? (
              <Row icon="pricetag-outline" label="Brand" value={item.brand} />
            ) : null}
            <Row
              icon="calendar-outline"
              label="Added"
              value={new Date(item.createdAt).toLocaleDateString()}
            />
          </View>

          {/* Tags */}
          {item.tags.length > 0 && (
            <View>
              <Text className="text-xs font-semibold text-muted uppercase mb-2">Tags</Text>
              <View className="flex-row flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <View
                    key={tag}
                    className="bg-primary/10 px-3 py-1 rounded-full"
                  >
                    <Text className="text-primary text-sm">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon as any} size={18} color="#9ca3af" />
      <Text className="text-muted text-sm w-16">{label}</Text>
      <Text className="text-primary flex-1 font-medium capitalize">{value}</Text>
    </View>
  );
}
