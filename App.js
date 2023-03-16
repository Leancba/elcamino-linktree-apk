import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Picker, Image, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import './firebase/config'

import {getFirestore , doc, updateDoc, getDoc} from 'firebase/firestore'

export default function App() {
  const [Producto, setProducto] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [saveMessage, setSaveMessage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log(selectedItem?.name)
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleSelectItem = (itemValue) => {
    
    if (itemValue !== 'Selecciona un producto') {

      setSelectedItem(Producto.find((producto) => producto.name === itemValue));
      
      setSelectedImage(require(`./images/${itemValue}.png`));

    } else {

      setSelectedItem('');
      setInputValue('');
      setSelectedImage(null)
      
    }
  };

  /*actualizar numero de telefono*/ 
  const updateNumber = async () => {

      try {
      
        const querydb = getFirestore();
        const docRef = doc(querydb, "productos", "dck0weMkIBJ8qgXGnuPI");
        
        await updateDoc(docRef, { [selectedItem?.name]: inputValue });
  
      } catch (error) {

        console.log(error)
        throw new Error('Error en la peticion put de Number', error);
      }
    };
  
  /*actualizar numero de telefono*/ 


  const handleSave = () => {
    // Agrega aquí el código para guardar los datos a la base de datos
    setSaveMessage('Los datos se guardaron correctamente');
  };


  return (
    <View>

      {selectedImage && <Image source={selectedImage} style={{ width: 100, height: 100 }} />}
      <Text>{selectedItem ? selectedItem.value : null}</Text>
      
      <Picker
        selectedValue={selectedItem ? selectedItem.name : null}
        onValueChange={handleSelectItem}>
          <Picker.Item label="Selecciona un producto" value={'Selecciona un producto'} />
            {Producto && Producto.map((item) => (
          <Picker.Item key={item.name} label={item.name} value={item.name} />
          ))}
      </Picker>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Ingrese el nuevo valor aquí"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Button title="Guardar" onPress={updateNumber} />
      {saveMessage && <Text>{saveMessage}</Text>}

      
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