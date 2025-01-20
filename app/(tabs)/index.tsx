import React, { useState, useEffect } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BottleAnimation from '@/components/BottleAnimation';
import { Modal, Button, StyleSheet } from 'react-native';

import { Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [pools, setPools] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const randomize = () => {
    if (pools.items.length === 0) {
      Alert.alert('No items available to randomize.');
      return;
    }
    const randomItem =
    pools.items[Math.floor(Math.random() * pools.items.length)];
    setSelectedItem(randomItem);
    setModalVisible(true);
  };

  //  for selecteing items
  
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');

  // Fetch lists from AsyncStorage
  const fetchLists = async () => {
    try {
      const data = await AsyncStorage.getItem('lists');
      const parsedData = data ? JSON.parse(data) : [];
      setLists(parsedData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load lists from storage.');
    }
  };

  const fetchPools = async (listName) => {
    const data = await AsyncStorage.getItem('lists');
    const parsedData = data ? JSON.parse(data) : [];
    const pool = parsedData.find((list) => list.name === listName);
    if (pool && pool.items.lenght != 0) {
      setPools(pool); // Update the pools state with the list's items
    } else {
      setPools([]); // Reset if the listName is invalid
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
      <View style={styles.container}>
        <Text style={styles.title}> Select a Random Pool</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.5)" />
        {/* this needed to be drop down list select pool we need 
        onselected => (get pool items) => setPools*/}

        <View style={styles.picker_feild}>
          {/* <Text style={styles.label}>Select a List:</Text> */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedList}
              onValueChange={(itemValue) =>{ 
                setSelectedList(itemValue); 
                // fetch and update the pool list
                fetchPools(itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a list" value="" />
              {lists.map((list, index) => (
                <Picker.Item key={index} label={list.name} value={list.name} />
              ))}
            </Picker>
          </View>
          {selectedList ? <Text style={styles.selectedText}>Selected pool: {selectedList}</Text> : null}
        </View>
        <Text >items in pools: {pools.items} ...</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.5)" />
        <Text style={styles.button} onPress={() => {randomize();}}>Randomize!</Text>
        {/* <BottleAnimation
        selectedItem={selectedItem}
        rng_fn={randomize}
        onFinish={() =>
          {
            setModalVisible(true);
            // setSelectedItem(null);
          }
        }
        /> */}

      <Modal
        animationType="slide" // Options: 'none', 'fade', 'slide'
        transparent={true} // Makes the background transparent
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false); setSelectedItem(null);}} // Android Back Button
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{selectedItem}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    backgroundColor: "rgba(53, 147, 255, 0.5)",
    borderRadius: 100,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 200,
    width: 300,
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  picker_feild: {
    justifyContent: 'center',
    padding: 4,
  },
});
