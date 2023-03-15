import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { useState, useEffect } from 'react';
import './firebase/config'

import {getFirestore , doc, updateDoc, getDoc} from 'firebase/firestore'

export default function App() {
  const [Producto, setProducto] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const querydb = getFirestore();
    const queryDoc = doc(querydb, 'productos', 'dck0weMkIBJ8qgXGnuPI');
    getDoc(queryDoc)
      .then(res => {
        const data = res.data();
        const productosArray = Object.entries(data).map(([name, value]) => ({ name, value }));
        setProducto(productosArray);
      })
      .catch(error => console.log(error));
  }, []);

  const handleSelectItem = (itemValue, itemIndex) => {
    setSelectedItem(Producto?.[itemIndex]);
  };

  return (
    <View>
      <Picker
        selectedValue={selectedItem ? selectedItem.name : null}
        onValueChange={handleSelectItem}>
        {Producto && Producto.map((item) => (
          <Picker.Item key={item.name} label={item.name} value={item.name} />
        ))}
      </Picker>
      <Text>{selectedItem ? selectedItem.value : null}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
