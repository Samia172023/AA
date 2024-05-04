import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Button,
  Image,
  SafeAreaView,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useState ,useEffect,useLayoutEffect } from "react";

const FirstPage = ({ navigation })=> {
    useLayoutEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);


  const handleOnboarding1 = () => {
    navigation.navigate("OnBoarding1"); 
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleOnboarding1(); // Call the function
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <View style={styles.container}>
    <Image
      style={styles.iHealthLogo}
      source={require("./assets/we.png")}
      resizeMode="contain"
    />
      <Text style = {styles.name} >iHealth</Text>
      <Text style = {styles.slogan}> 24/7 medication assistance, </Text>
      <Text style = {styles.slogan2}> always by your side. </Text>
      <StatusBar style="auto" />
    </View>
  );
}
export default FirstPage;
  
  
const styles = StyleSheet.create({
  loginImage: {
    width:241,
    height :84
  },
  name : {
      paddingTop:31,
      fontSize: 26,
      // fontFamily:'Poppins-bold',
      fontWeight: 'bold',
      color : '#209F84',
      

  } ,
  slogan : {
    paddingTop:31,
    fontSize:18,
    color : '#908F8F',
  },
   slogan2: {
   
    fontSize:18,
    color : '#908F8F',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iHealthLogo: {
    width: 2000, // Adjust this value to ensure the entire logo is visible
    height: 100,
    marginLeft: -34,
    marginBottom: -5,
  },

});
