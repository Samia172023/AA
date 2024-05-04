import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginSignUpForm from './LoginSignUpForm';
import LoginForm from './Login';
import SignUpForm from './Signup';
import FirstPage from './FirstPage';
import OnBoarding1 from './OnBoarding1';
import OnBoarding2 from './OnBoarding2';
import OnBoarding3 from './OnBoarding3';
import OpeningPage from './OpeningPage';
import Test from './Test';
import Test2 from './Test2';
import Emergency from './Emergency';
import Emergency2 from './Emergency2';
const Stack = createStackNavigator();

const App = () => {
  return (

    
     <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="OpeningPage" component={OpeningPage} />
      <Stack.Screen name ="Emergency" component={Emergency}/>
        <Stack.Screen name="Test" component={Test} />
      <Stack.Screen name="Test2" component={Test2} />
      <Stack.Screen name="Emergency2" component={Emergency2} />

       </Stack.Navigator>
     </NavigationContainer> 

  );
};

export default App;
