import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

// 🚀 Lazy Load Screens (Except Settings, which loads instantly)

// 📌 Regular Imports (SettingsScreen Now Loads Instantly)
import CreatePinScreen from './PinScreen/CreatePinScreen';
import ConfirmPinScreen from './PinScreen/ConfirmPinScreen';
import TouchId from './idVerification/TouchId';
import FaceId from './idVerification/FaceId';
import PinSettingsScreen from '@/settings/securitySettings/PinSettingsScreen';

const Stack = createStackNavigator();

// ✅ Main Stack Navigator
const StackNavigator = () => {
  return (
    <NavigationContainer>
      {/* 🏆 Settings Screens (Instant Load) */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          detachPreviousScreen: true,
        }}>
        <Stack.Screen name="PinSettings" component={PinSettingsScreen} />
        <Stack.Screen name="CreatePin" component={CreatePinScreen} />
        <Stack.Screen name="ConfirmPin" component={ConfirmPinScreen} />
        <Stack.Screen name="TouchId" component={TouchId} />
        <Stack.Screen name="FaceId" component={FaceId} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
