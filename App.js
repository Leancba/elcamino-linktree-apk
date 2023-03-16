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
  ScrollView
} from "react-native";
import "./firebase/config";
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
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    callProductsDb();
  }, []);

  const handlePress = (option) => {
    setSelectedName(option.name);
    setSelectedValue(option.value);
    setSelectedProductImage(images[option.name]);
    console.log(selectedProductImage);

    setModalVisible(false);
  };

  const updateNumber = async () => {
    if (inputValue || typeof inputValue === "number") {
      try {
        const querydb = getFirestore();
        const docRef = doc(querydb, "productos", "dck0weMkIBJ8qgXGnuPI");

        await updateDoc(docRef, { [selectedName]: inputValue });

        setInputValue("");
        setSaveMessage("El numero se ha guardado correctamente");
        callProductsDb();
        setSelectedValue(inputValue);
        setTimeout(() => {
          setSaveMessage("");
        }, 3000);
      } catch (error) {
        console.log(error);
        throw new Error("Error en la peticion put de Number", error);
      }
    } else {
      setSaveMessage("Error, debe escribir un numero");
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
      console.log("probando");
    }
  };

  return (
    <View style={styles.container}>
      {selectedProductImage && (
        <Image style={styles.productImage} source={selectedProductImage} />
      )}

      {selectedValue && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Precio actual :</Text>
          <Text style={styles.priceValue}>${selectedValue}</Text>
        </View>
      )}

      <TouchableHighlight
        style={styles.button}
        onPress={() => setModalVisible(true)}
        underlayColor="#ccc"
      >
        <Text style={selectedName ? styles.productTitle : styles.catalogTitle}>
          {selectedName || "Abrir catálogo"}
        </Text>
      </TouchableHighlight>
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
              placeholder="Cantidad"
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
          </>
        ) : (
          <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Selecciona un producto para cambiar el precio</Text>
        </View>
        
        )}

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#999',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  catalogTitle: {
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
    backgroundColor: "#86abf9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
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
    padding: 20,
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
    backgroundColor: "#EEE",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "90%",
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
