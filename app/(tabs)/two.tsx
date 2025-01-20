// import { StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

// export default function TabTwoScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage your pool</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });

// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const storedLists = await AsyncStorage.getItem('lists');
    if (storedLists) setLists(JSON.parse(storedLists));
  };

  const saveLists = async (updatedLists) => {
    setLists(updatedLists);
    await AsyncStorage.setItem('lists', JSON.stringify(updatedLists));
  };

  const addList = () => {
    if (newListName.trim() === '') return;
    const updatedLists = [...lists, { name: newListName, items: [] }];
    saveLists(updatedLists);
    setNewListName('');
  };

  const deleteList = (index) => {
    const updatedLists = lists.filter((_, i) => i !== index);
    saveLists(updatedLists);
  };

  const addItemToList = () => {
    if (newItem.trim() === '') return;
    const updatedLists = lists.map((list) => {
      if (list.name === selectedList.name) {
        return { ...list, items: [...list.items, newItem] };
      }
      return list;
    });
    saveLists(updatedLists);
    const updatedSelectedList = updatedLists.find((list) => list.name === selectedList.name);
    setSelectedList(updatedSelectedList);
    setNewItem('');
  };

  const deleteItemFromList = (itemIndex) => {
    const updatedLists = lists.map((list) => {
      if (list.name === selectedList.name) {
        const updatedItems = list.items.filter((_, i) => i !== itemIndex);
        return { ...list, items: updatedItems };
      }
      return list;
    });
    saveLists(updatedLists);
    const updatedSelectedList = updatedLists.find((list) => list.name === selectedList.name);
    setSelectedList(updatedSelectedList);
  };

  if (selectedList) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{selectedList.name}</Text>
        <FlatList
          data={selectedList.items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text>{item}</Text>
              <TouchableOpacity
                onPress={() => deleteItemFromList(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add Item"
            value={newItem}
            onChangeText={setNewItem}
          />
          <TouchableOpacity onPress={addItemToList} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setSelectedList(null)}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listCard}>
            <TouchableOpacity onPress={() => setSelectedList(item)}>
              <Text style={styles.listName}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteList(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="New List Name"
          value={newListName}
          onChangeText={setNewListName}
        />
        <TouchableOpacity onPress={addList} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  listCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  listName: { fontSize: 18 },
  deleteButton: { backgroundColor: 'red', padding: 8, borderRadius: 4 },
  deleteButtonText: { color: 'white' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  addButton: { backgroundColor: 'blue', padding: 8, borderRadius: 4 },
  addButtonText: { color: 'white' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
  },
  backButton: { marginTop: 16, padding: 8, backgroundColor: 'gray', borderRadius: 4 },
  backButtonText: { color: 'white', textAlign: 'center' },
});
