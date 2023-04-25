import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Forge from './Screens/Forge';
import Config from './Screens/Config';
import Bazaar from './Screens/Bazaar';
import Recipes from './Screens/Recipes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{
      colors: {
        background: '#242323', backgroundColor: '#242323', card: '#242323', text: '#bcc3cf',
      },
    }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Forge" component={Forge} />
        <Stack.Screen name="Config" component={Config} />
        <Stack.Screen name="Bazaar" component={Bazaar} />
        <Stack.Screen name="Recipes" component={Recipes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
