import React, { useState, useEffect, useMemo } from 'react';
import { View, TextInput, StyleSheet, Image, FlatList, Text, TouchableOpacity } from 'react-native';
import pharmaciesData from './API/outputEmergency.json'; // Import emergency pharmacies data

const Test = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [numColumns, setNumColumns] = useState(1); // State for number of columns

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("./assets/Back.png")}
            style={{ width: 25, height: 25, marginLeft: 10 }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Image
          source={require("./assets/Allpharmacie.png")}
          style={{ width: 24.5, height: 25.57, marginRight: 30, marginTop: -8 }}
        />
      ),
      headerTitle: "All Pharmacies",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
      headerTitleAlign: 'center',
      headerStyle: {
        height: 100,
        borderBottomWidth: 0,
      },
    });
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch the local JSON file
      const data = require('./API/output.json');

      // Modify the data as needed
      const modifiedPharmacies = data.map(pharmacy => ({
        ...pharmacy,
        pharmacy: convertToEnglish(pharmacy.name),
      }));

      // Update the state with the modified data
      setPharmacies(modifiedPharmacies);
      setSearchResults(modifiedPharmacies); // Initially set search results to all pharmacies
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const convertToEnglish = (name) => {
    if (name) {
      return name.replace(/Pharmacie/g, 'Pharmacy');
    } else {
      return ''; // Return an empty string if 'name' is undefined
    }
  };

  const fetchSearchResults = (query) => {
    return pharmacies.filter(result => result.pharmacy.toLowerCase().includes(query.toLowerCase()));
  };

  const handleInputChange = (text) => {
    setSearchQuery(text);
    if (text.trim() !== '') {
      const results = fetchSearchResults(text);
      setSearchResults(results);
    } else {
      setSearchResults(pharmacies); // If search query is empty, show all pharmacies
    }
  };

  const renderItem = ({ item }) => {
    const isEmergency = pharmaciesData.some(emergencyPharmacy => emergencyPharmacy.name === item.pharmacy);

    const navigateToDetails = () => {
      navigation.navigate('Test2', {
        address: item.address,
        pharmacy: item.pharmacy,
        isEmergency: isEmergency,
        ...(item.telephone && { telephone: item.telephone }), // Include telephone if it exists
        ...(item.mapLink && { mapLink: item.mapLink }), // Include mapLink if it exists
      });
    };

    return (
      <TouchableOpacity onPress={navigateToDetails}>
        <View style={styles.pharmacyContainer}>
          <Image
            style={{ width: 50, height: 50, marginRight: 2 }}
            source={require('./assets/PharmacyIcon.png')}
            resizeMode="contain"
          />
          <View style={styles.pharmacyInfo}>
            <Text style={styles.pharmacyName}>{item.pharmacy}</Text>
            <View style={isEmergency ? styles.EmergencyContainer : styles.nonEmergencyContainer}>
            <Text style={isEmergency ? styles.Emergency : styles.nonEmergency}>{isEmergency ? 'Emergency today' : 'Non-emergency today'}</Text>
          </View>
          </View>
          <View style={styles.moreDetailsButton}>
            <Text style={styles.moreDetailsText}>More details</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = useMemo(() => (item, index) => index.toString(), []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
          style={styles.iconSearch}
          source={require('./assets/Search.png')}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          onChangeText={handleInputChange}
          value={searchQuery}
          placeholder="Search pharmacy..."
          placeholderTextColor="#ADADAD"
        />
      </View>
      <FlatList
        style={styles.list}
        data={searchQuery.length > 0 ? searchResults : pharmacies}
        renderItem={renderItem}
        key={numColumns}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
      />
      <View style={styles.bottomNavigationBar}>
        <TouchableOpacity>
          <Image
            style={styles.icon}
            source={require("./assets/Bar/home.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.icon}
            source={require("./assets/Bar/email.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.icon}
            source={require("./assets/Bar/Panier.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.icon}
            source={require("./assets/Bar/User.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E8F3F1',
    borderWidth: 2,
    marginBottom: 10,
    borderRadius: 24,
    width: 374,
    height: 40,
    backgroundColor: '#F9FAFB',
    color: '#ADADAD',
  },
  iconSearch: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  input: {
    height: 40,
    flex: 1,
    color: '#ADADAD',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  pharmacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    marginBottom: 10,
    height: 75,
  },
  pharmacyInfo: {
    width: 220,
    marginLeft: 10,
  },
  pharmacyName: {
    color: '#0C2638',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  nonEmergencyContainer: {
    backgroundColor: 'white',
    marginLeft: 33,
    width: 168,
    height: 20,
    borderRadius: 30,
  },
  EmergencyContainer: {
    backgroundColor: 'white',
    marginLeft: 55,
    height:22,
    width:140,
    borderRadius: 30,
  },
  Emergency:{
    color: '#F93625',
    marginLeft: 12,
    fontSize: 14,
    height:22,
    width:120,
    fontWeight: '600',
    borderRadius:16,
  },
  nonEmergency: {
    color: '#199A8E',
    marginLeft: 40,
    fontSize: 14,
    backgroundColor:'white',
    height:22,
    width:155,
    fontWeight: '600',
    marginLeft: 10,
    borderRadius:16,
  },

  moreDetailsButton: {
    backgroundColor: '#B7B9BD',
    borderRadius: 100,
    padding: 8,
    textAlign: 'center',
    height: 25,
    width: 89,
  },
  moreDetailsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: -10,
    marginTop: -4,
    textAlignVertical: 'center',
  },
  bottomNavigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default Test;
