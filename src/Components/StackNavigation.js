import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateNote from '../Screens/CreateNote';
import HomeScreen from '../Screens/HomeScreen';
import BlockDetail from "../Screens/BlockDetail";
import SplashScreen from '../Screens/SplashScreen';

const Stack = createStackNavigator();

const BlockNaviggation = () => (
    <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Splash"
            headerMode="none"
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Note" component={CreateNote} />
            <Stack.Screen name="Detail" component={BlockDetail} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default () => (
    <BlockNaviggation />
);