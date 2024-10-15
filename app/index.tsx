import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
};

const initialList: ShoppingListItemType[] = [
  { id: "1", name: "Coffee" },
  { id: "2", name: "Tea" },
  { id: "3", name: "Sugar" },
  { id: "4", name: "Milk" },
  { id: "5", name: "Bread" },
  { id: "6", name: "Butter" },
  { id: "7", name: "Eggs" },
  { id: "8", name: "Cheese" },
  { id: "9", name: "Yogurt" },
  { id: "10", name: "Juice" },
  { id: "11", name: "Fruit" },
  { id: "12", name: "Vegetables" },
  { id: "13", name: "Meat" },
  { id: "14", name: "Fish" },
  { id: "15", name: "Pasta" },
  { id: "16", name: "Rice" },
  { id: "17", name: "Beans" },
];

export default function App() {
  const [value, setValue] = useState("");
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);
  const handleSubmit = () => {
    if (value) {
      setShoppingList([
        { id: Date.now().toString(), name: value },
        ...shoppingList,
      ]);
      setValue("");
    }
  };
  const handleDelete = (id: string) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id));
  };
  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp ? undefined : Date.now(),
        };
      }
      return item;
    });
    setShoppingList(newShoppingList);
  }
  return (
    <FlatList
      data={shoppingList}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          value={value}
          style={styles.textInput}
          onChangeText={setValue}
          placeholder="E.g Coffee"
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
          isCompleted={!!item.completedAtTimestamp} // !! converts to boolean
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
