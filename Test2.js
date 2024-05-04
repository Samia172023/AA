import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Platform, UIManager } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Test2 = ({ route, navigation }) => {
  const { address, pharmacy, telephone, mapLink, isEmergency } = route.params;
  const [phoneNumber, setPhoneNumber] = useState(telephone);
  const processedPhoneNumber = phoneNumber.replace(/(\+212)\s0/, '$1 ');
  const contentHeight = useRef(0);
  const mapRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [pharmacies, setPharmacies] = useState([]);

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

    // Calculate initial region based on mapLink
    if (mapLink) {
      const coordinates = mapLink.split('place/')[1]?.trim()?.split(',');
      if (coordinates && coordinates.length === 2) {
        const latitude = parseFloat(coordinates[0]);
        const longitude = parseFloat(coordinates[1]);
        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    }

    // Set pharmacies
    if (pharmacy) {
      setPharmacies([{
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
        name: pharmacy,
        address: address,
      }]);
    }
  }, [mapLink, navigation, pharmacy, address, initialRegion.latitude, initialRegion.longitude]);

  const handleContactPress = (newPhoneNumber) => {
    newPhoneNumber = newPhoneNumber.replace(/\s/g, '');
    const url = `tel:${newPhoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const handleButtonClick = () => {
    console.log('Button clicked! Show available medicine.');
  };

  const handleLayoutChange = (event) => {
    const { height } = event.nativeEvent.layout;
    contentHeight.current = height;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Image
            style={{ width: 120, height: 120, marginRight: 10 }}
            source={require('./assets/PharmacyIcon.png')}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <View style={{ width: 150 }}>
              <Text style={styles.Name}>{pharmacy}</Text>
            </View>
            <View style={isEmergency ? styles.EmergencyContainer : styles.nonEmergencyContainer}>
            <Text style={isEmergency ? styles.Emergency : styles.nonEmergency}>{isEmergency ? 'Emergency today' : 'Non-emergency today'}</Text>

            </View>
          </View>
        </View>
        <View
          style={styles.contactAndAddressContainer}
          onLayout={handleLayoutChange}
        >
          <View style={styles.addressContainer}>
            <Image
              style={{ width: 35, height: 35, marginRight: 10 }}
              source={require('./assets/Localisation.png')}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.address}>
                {address.replace(/[0-9][0-9][0-9][0-9][0-9] ?-? ? TANGER - Maroc/g, '')}
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 15 }}> Tangier - Maroc</Text>
            </View>
          </View>
          <View style={styles.contactContainer}>
            <Image
              style={{ width: 35, height: 35, marginRight: 10 }}
              source={require('./assets/Contact.png')}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              {phoneNumber && (
                <TouchableOpacity onPress={() => handleContactPress(processedPhoneNumber)}>
                  <Text style={styles.contactNumber}>{processedPhoneNumber}</Text>
                </TouchableOpacity>
              )}
              <Text style={{ color: '#94A3B8', fontSize: 15 }}>Contact Us Here</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
            <Text style={styles.buttonText}>Click to see available medicine</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Location</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={{ height: 200, width: '100%' }}
            initialRegion={initialRegion}
            provider={PROVIDER_GOOGLE}
          >
            {pharmacies.map((pharmacy, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: pharmacy.latitude,
                  longitude: pharmacy.longitude,
                }}
                title={pharmacy.name}
                description={pharmacy.address}
              />
            ))}
          </MapView>
        </View>
      </ScrollView>
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
    backgroundColor: 'white',
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    marginLeft: 10,
  },
  Name: {
    color: 'black',
    marginTop: 5,
    width: 276,
    fontSize: 25,
    marginLeft: -25,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  nonEmergencyContainer: {
    backgroundColor: '#FEF6F5',
    marginLeft: 33,
    width: 168,
    height: 20,
    borderRadius: 30,
  },
  EmergencyContainer: {
    backgroundColor: '#FEF6F5',
    marginLeft: 40,
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

  contactAndAddressContainer: {
    marginLeft: 6,
    width: 367,
    borderColor: '#9747FF',
    borderWidth: 3,
    borderStyle: 'dashed',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 15,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
    marginLeft: 15,
  },
  mapContainer: {
    height: 200, // Adjusted height
    marginBottom: 15,
    alignSelf: 'stretch', // Make sure the map stretches to fill its container horizontally
  },
  contactNumber: {
    color: '#475569',
    fontWeight: '500',
    marginRight: 5,
    fontSize: 15,
    marginBottom: 3,
  },
  contactText: {
    color: '#94A3B8',
  },
  address: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
  },
  mapLink: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#FF6347',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: 256,
    height: 30,
  },
  buttonText: {
    marginTop: -5,
    color: '#00FFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 25,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
  icon: {
    width: 24,
    height: 24,
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default Test2;
