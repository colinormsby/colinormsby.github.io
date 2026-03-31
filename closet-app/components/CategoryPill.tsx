import { TouchableOpacity, Text } from "react-native";
import type { Category } from "../types";

interface Props {
  label: string;
  value: Category | "all";
  active: boolean;
  onPress: () => void;
}

export default function CategoryPill({ label, active, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-2 px-4 py-1.5 rounded-full border ${
        active
          ? "bg-accent border-accent"
          : "bg-white border-gray-200"
      }`}
    >
      <Text
        className={`text-sm font-medium ${active ? "text-white" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
