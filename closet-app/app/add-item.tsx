import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useClosetStore } from "../store/closetStore";
import { removeBackground, persistImage } from "../lib/backgroundRemoval";
import { saveItem } from "../lib/database";
import { CATEGORIES, generateId } from "../lib/utils";
import type { Category, ClothingItem } from "../types";

export default function AddItemScreen() {
  const router = useRouter();
  const addItem = useClosetStore((s) => s.addItem);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processedUri, setProcessedUri] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("tops");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required to take photos.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  }

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  }

  async function processImage(uri: string) {
    setImageUri(uri);
    setProcessedUri(null);
    setProcessing(true);
    try {
      const originalPersisted = await persistImage(uri);
      const noBg = await removeBackground(originalPersisted);
      setProcessedUri(noBg);
    } catch (err) {
      console.error(err);
      // Fall back to original
      setProcessedUri(uri);
    } finally {
      setProcessing(false);
    }
  }

  async function handleSave() {
    if (!processedUri) {
      Alert.alert("No image", "Please select a photo first.");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a name for this item.");
      return;
    }
    setSaving(true);
    try {
      const item: ClothingItem = {
        id: generateId(),
        imageUri: processedUri,
        originalUri: imageUri!,
        name: name.trim(),
        category,
        color: color.trim() || "unknown",
        brand: brand.trim() || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        createdAt: Date.now(),
      };
      addItem(item);
      await saveItem(item);
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to save item. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const displayUri = processedUri ?? imageUri;
  const clothingCategories = CATEGORIES.filter((c) => c.value !== "all");

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Photo picker */}
      <View className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">
        {displayUri ? (
          <View>
            <Image
              source={{ uri: displayUri }}
              className="w-full h-72"
              resizeMode="contain"
              style={{ backgroundColor: "#f3f4f6" }}
            />
            {processing && (
              <View className="absolute inset-0 bg-black/40 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="text-white mt-2">Removing background…</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => { setImageUri(null); setProcessedUri(null); }}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
            >
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="h-56 items-center justify-center gap-4">
            <Ionicons name="camera-outline" size={48} color="#d1d5db" />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={pickFromCamera}
                className="bg-primary px-5 py-2.5 rounded-xl flex-row items-center gap-2"
              >
                <Ionicons name="camera" size={18} color="#fff" />
                <Text className="text-white font-semibold">Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickFromLibrary}
                className="bg-primary px-5 py-2.5 rounded-xl flex-row items-center gap-2"
              >
                <Ionicons name="images" size={18} color="#fff" />
                <Text className="text-white font-semibold">Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Form */}
      <View className="bg-white rounded-2xl p-4 shadow-sm gap-4">
        <View>
          <Text className="text-xs font-semibold text-muted uppercase mb-1">Name *</Text>
          <TextInput
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-base"
            placeholder="e.g. White Oxford Shirt"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View>
          <Text className="text-xs font-semibold text-muted uppercase mb-2">Category *</Text>
          <View className="flex-row flex-wrap gap-2">
            {clothingCategories.map((c) => (
              <TouchableOpacity
                key={c.value}
                onPress={() => setCategory(c.value as Category)}
                className={`px-3 py-1.5 rounded-xl border ${
                  category === c.value
                    ? "bg-primary border-primary"
                    : "border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    category === c.value ? "text-white" : "text-gray-600"
                  }`}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text className="text-xs font-semibold text-muted uppercase mb-1">Color</Text>
          <TextInput
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-base"
            placeholder="e.g. navy blue"
            value={color}
            onChangeText={setColor}
          />
        </View>

        <View>
          <Text className="text-xs font-semibold text-muted uppercase mb-1">Brand</Text>
          <TextInput
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-base"
            placeholder="e.g. Uniqlo (optional)"
            value={brand}
            onChangeText={setBrand}
          />
        </View>

        <View>
          <Text className="text-xs font-semibold text-muted uppercase mb-1">
            Tags <Text className="normal-case font-normal text-muted">(comma-separated)</Text>
          </Text>
          <TextInput
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-base"
            placeholder="e.g. casual, summer, work"
            value={tags}
            onChangeText={setTags}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={saving || processing}
        className={`mt-4 py-4 rounded-2xl items-center ${
          saving || processing ? "bg-gray-300" : "bg-accent"
        }`}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">Save to Closet</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
