import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";

const storageKey = "shopping-list";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

const initialList: ShoppingListItemType[] = [
  // { id: "1", name: "Coffee", lastUpdatedTimestamp: Date.now() },
  // { id: "2", name: "Tea", lastUpdatedTimestamp: Date.now() },
  // { id: "3", name: "Sugar", lastUpdatedTimestamp: Date.now() },
  // { id: "4", name: "Milk", lastUpdatedTimestamp: Date.now() },
  // { id: "5", name: "Bread", lastUpdatedTimestamp: Date.now() },
  // { id: "6", name: "Butter", lastUpdatedTimestamp: Date.now() },
  // { id: "7", name: "Eggs", lastUpdatedTimestamp: Date.now() },
  // { id: "8", name: "Cheese", lastUpdatedTimestamp: Date.now() },
  // { id: "9", name: "Yogurt", lastUpdatedTimestamp: Date.now() },
  // { id: "10", name: "Juice", lastUpdatedTimestamp: Date.now() },
  // { id: "11", name: "Fruit", lastUpdatedTimestamp: Date.now() },
  // { id: "12", name: "Vegetables", lastUpdatedTimestamp: Date.now() },
  // { id: "13", name: "Meat", lastUpdatedTimestamp: Date.now() },
  // { id: "14", name: "Fish", lastUpdatedTimestamp: Date.now() },
  // { id: "15", name: "Pasta", lastUpdatedTimestamp: Date.now() },
  // { id: "16", name: "Rice", lastUpdatedTimestamp: Date.now() },
  // { id: "17", name: "Beans", lastUpdatedTimestamp: Date.now() },
];

export default function App() {
  const [value, setValue] = useState("");
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);

  useEffect(() => {
    const fetchInitialList = async () => {
      const data = await getFromStorage(storageKey);
      data && setShoppingList(data);
    };
    fetchInitialList();
  }, []);

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        {
          id: Date.now().toString(),
          name: value,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingList,
      ];
      saveToStorage(storageKey, newShoppingList);
      setShoppingList(newShoppingList);
      setValue("");
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    saveToStorage(storageKey, newShoppingList);
    setShoppingList(newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          lastUpdatedTimestamp: Date.now(),
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
        };
      }
      return item;
    });
    saveToStorage(storageKey, newShoppingList);
    setShoppingList(newShoppingList);
  };

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
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

const orderShoppingList = (shoppingList: ShoppingListItemType[]) => {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
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
