import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initDB, loadItems, loadOutfits } from "../lib/database";
import { useClosetStore } from "../store/closetStore";

export default function RootLayout() {
  const hydrate = useClosetStore((s) => s.hydrate);

  useEffect(() => {
    async function bootstrap() {
      await initDB();
      const [items, outfits] = await Promise.all([loadItems(), loadOutfits()]);
      hydrate(items, outfits);
    }
    bootstrap();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-item"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Add Clothing",
            headerStyle: { backgroundColor: "#1a1a2e" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="item/[id]"
          options={{
            headerShown: true,
            title: "Item Detail",
            headerStyle: { backgroundColor: "#1a1a2e" },
            headerTintColor: "#fff",
          }}
        />
      </Stack>
    </>
  );
}
