import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, FlatList, Text, TouchableOpacity } from 'react-native';
import pharmaciesData from './API/outputEmergency.json'; // Import pharmacies data from the file

const Emergency = ({ navigation }) => {
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
          headerTitle: "Emergency Pharmacies",
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

    const [searchQuery, setSearchQuery] = useState('');
    const [pharmacies, setPharmacies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setPharmacies(pharmaciesData);
        setSearchResults(pharmaciesData);
    }, []);

    const handleInputChange = (text) => {
        setSearchQuery(text);
        if (text.trim() !== '') {
            const results = fetchSearchResults(text);
            setSearchResults(results);
        } else {
            setSearchResults(pharmacies);
        }
    };

    const fetchSearchResults = (query) => {
        return pharmacies.filter(result => result.name.toLowerCase().includes(query.toLowerCase()));
    };

    const navigateToDetails = (item) => {
        navigation.navigate('Emergency2', {
            latitude: item.latitude,
            longitude: item.longitude,
            name: item.name,
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigateToDetails(item)}>
            <View style={styles.pharmacyContainer}>
                <Image
                    style={{ width: 50, height: 50, marginRight: 2 }}
                    source={require('./assets/PharmacyIcon.png')}
                    resizeMode="contain"
                />
                <View style={styles.pharmacyInfo}>
                    <Text style={styles.pharmacyName}>{item.name}</Text>
                </View>
                <TouchableOpacity style={styles.locationButton} onPress={() => navigateToDetails(item)}>
                    <Text style={styles.locationButtonText}>See Location</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

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
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
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
        width: 210,
        marginLeft: 10,
    },
    pharmacyName: {
        color: '#0C2638',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
    },
    locationButton: {
        backgroundColor: '#FF6347',
        borderRadius: 100,
        padding: 8,
        textAlign: 'center',
        height: 25,
        marginLeft:-16,
        marginRight:10,
        width: 99,
    },
    locationButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12,
        marginBottom: -10,
        marginTop: -4,
        textAlignVertical: 'center',
        fontWeight: '600',
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
    scrollContainer: {
        flexGrow: 1,
    },
});

export default Emergency;
