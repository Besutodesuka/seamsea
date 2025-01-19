import React, { useState } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BottleAnimation from '@/components/BottleAnimation';
import { Modal, Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [pools, setPools] = useState([
    { name: 'Example Pool', items: ['Alice', 'Bob', 'Charlie'] },
  ]);
  const [selectedPool, setSelectedPool] = useState(pools[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const randomize = () => {
    const randomItem =
      selectedPool.items[Math.floor(Math.random() * selectedPool.items.length)];
    setSelectedItem(randomItem);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}> Select a Random Pool</Text>

        {/* this needed to be drop down list select pool we need 
        onselected => (get pool items) => setPools*/}
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.5)" />

        <Text> Selected pool : {selectedPool.name}</Text>

        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.5)" />
        
        <Text style={styles.button} onPress={() => {randomize(); setModalVisible(true);}}>Randomize!</Text>
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
  )
}

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
// });

// export default function TabOneScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Home</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="app/(tabs)/index.tsx" />
//     </View>
//   );
// }

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
});
