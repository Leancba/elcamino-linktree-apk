import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

import "./firebase/config";
import Spinner from 'react-native-loading-spinner-overlay';
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

import ABLANDADOR from "./images/ABLANDADOR.png";
import FANTASIA from "./images/FANTASIA.png";
import KIT from "./images/KIT.png";
import OLEOS from "./images/OLEOS.png";
import PACK from "./images/PACK.png";
import POLVODECOLORANTE20GR from "./images/POLVODECOLORANTE20GR.png";
import POLVODECOLORANTE20GRFI from "./images/POLVODECOLORANTE20GRFI.png";
import SHAMPOOBLACK from "./images/SHAMPOOBLACK.png";
import SHAMPOOSILVER from "./images/SHAMPOOSILVER.png";
import SHOCKS from "./images/SHOCKS.png";

const SelectInput = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedName, setSelectedName] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productos, setproductos] = useState("");

  const [inputValue, setInputValue] = useState("");

  const [saveMessage, setSaveMessage] = useState(null);

  const images = {
    ABLANDADOR: ABLANDADOR,
    FANTASIA: FANTASIA,
    KIT: KIT,
    OLEOS: OLEOS,
    PACK: PACK,
    POLVODECOLORANTE20GR: POLVODECOLORANTE20GR,
    POLVODECOLORANTE20GRFI: POLVODECOLORANTE20GRFI,
    SHAMPOOBLACK: SHAMPOOBLACK,
    ABLANDADOR: ABLANDADOR,
    SHAMPOOSILVER: SHAMPOOSILVER,
    SHOCKS: SHOCKS,
  };

  const callProductsDb = () => {

    const querydb = getFirestore();
    const queryDoc = doc(querydb, "productos", "dck0weMkIBJ8qgXGnuPI");
    getDoc(queryDoc)
      .then((res) => {
        const data = res.data();
        const productosArray = Object.entries(data).map(([name, value]) => ({
          name,
          value,
        }));
        setproductos(productosArray);
        setLoadingProducts(false)
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    callProductsDb();
  }, []);

  const clearStates = () => {
    setSelectedName('');
    setSelectedValue('');
    setSelectedProductImage('');
    setSaveMessage('')

  }

  const handlePress = (option) => {
    setSelectedName(option.name);
    setSelectedValue(option.value);
    setSelectedProductImage(images[option.name]);
    setModalVisible(false);
  };

  const updateNumber = async () => {
    if (inputValue || typeof inputValue === "number") {
      try {
        const querydb = getFirestore();
        const docRef = doc(querydb, "productos", "dck0weMkIBJ8qgXGnuPI");

        await updateDoc(docRef, { [selectedName]: inputValue });

        setInputValue("");
        setSaveMessage("El valor se ha actualizado correctamente!");
        callProductsDb();
        setSelectedValue(inputValue);
        setTimeout(() => {
          clearStates();
        }, 3000);
      } catch (error) {
        console.log(error);
        throw new Error("Error en la peticion put de Number", error);
      }
    } else {
      setSaveMessage("Error, debe escribir un numero!");
      setTimeout(() => {
        setSaveMessage("");
    
      }, 3000);
    }
  };

  return (
    <View style={styles.containergeneral}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Panel de control</Text>
      </View>

      <View style={styles.container}>
  {loadingProducts ? (
    <View style={styles.loadingContainer}>
       <Spinner
          visible={loadingProducts}
          textContent={'Cargando catalogo...'}
          textStyle={styles.spinnerTextStyle}
        />
    </View>
  ) : (
    <>
      {selectedProductImage && (
        <Image style={styles.productImage} source={selectedProductImage} />
      )}
      {selectedValue && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Precio actual :</Text>
          <Text style={styles.priceValue}>${selectedValue}</Text>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView>
          <View style={styles.optionsContainer}>
            {productos &&
              productos.map((producto) => (
                <TouchableHighlight
                  key={producto.name}
                  style={styles.optionButton}
                  onPress={() => handlePress(producto)}
                  underlayColor="#ccc"
                >
                  <View style={styles.optionContainer}>
                    <Text style={styles.optionText}>{producto.name}</Text>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.productImageOption}
                        source={images[producto.name]}
                      />
                    </View>
                  </View>
                </TouchableHighlight>
              ))}
          </View>
        </ScrollView>
      </Modal>
      <View style={styles.modalBottom}>
        {selectedName ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="$"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
            />
            <TouchableHighlight
              style={styles.button}
              onPress={updateNumber}
              underlayColor="#ccc"
            >
              <Text style={styles.buttonText}>Actualizar Precio</Text>
            </TouchableHighlight>
            {saveMessage && (
          <Text
            style={[
              styles.message,
              saveMessage.includes("correctamente")
                ? styles.success
                : styles.error,
            ]}
          >
            {saveMessage}
          </Text>
        )}
            <TouchableHighlight
              style={styles.button}
              onPress={clearStates}
              underlayColor="#ccc"
            >
              <Text style={styles.buttonText}>⏎</Text>
            </TouchableHighlight>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <TouchableHighlight
              style={styles.button}
              onPress={() => setModalVisible(true)}
              underlayColor="#ccc"
            >
              <Text
                style={
                  selectedName ? styles.productTitle : styles.catalogTitle
                }
              >
                {selectedName || "Abrir catálogo"}
              </Text>
            </TouchableHighlight>
            <Text style={styles.placeholderText}>
              Selecciona un producto para cambiar el precio
            </Text>
          </View>
        )}
      </View>
    </>
  )}
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(118, 242, 255, 0.31);",
  },
  containergeneral: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },

  navbar: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },

  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#999",
  },

  productTitle: {
    
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  catalogTitle: {
    color: '#rgb(0, 0, 0);',
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  priceText: {
    fontWeight: "bold",
    marginRight: 5,
  },
  priceValue: {
    fontSize: 18,
  },

  productImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#rgb(0, 0, 0);",
    fontSize: 18,
    fontWeight: "bold",
  },
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  optionsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: "100%",
    width: "100%",
  },
  optionButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productImageOption: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
  },
  modalBottom: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: 'rgb(55, 41, 41);',
    backgroundColor: "#rgba(225, 225, 225, 0.7)",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "70%",
  },

  optionContainer: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  productImageOption: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default SelectInput;
