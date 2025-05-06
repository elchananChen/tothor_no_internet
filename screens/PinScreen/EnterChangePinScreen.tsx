import React, { useState } from 'react';
import { Dimensions, Vibration } from 'react-native';
import usePinStore from '../../context/pinStore';
import * as LocalAuthentication from 'expo-local-authentication';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import { IC_FaceID, IC_Fingerprint } from '@/utils/constants/Icons';
import { Props } from '@/types/NavigationTypes';

const { height } = Dimensions.get('window');

const EnterChangePinScreen: React.FC<Props> = ({ navigation }) => {
  const { pin, setPin, clearPin, deleteLastDigit } = usePinStore();
  const [message, setMessage] = useState<string>('');
  const { appliedTheme } = useTheme();
  const storedPin = '1234'; // Replace with actual stored PIN from secure storage

  const handlePinVerification = (updatedPin: string) => {
    if (updatedPin === storedPin) {
      setMessage('PIN Verified!');
      setTimeout(() => {
        clearPin();
        navigation.navigate('ChangePin');
      }, 300);
    } else {
      setMessage('Incorrect PIN. Try again.');
      Vibration.vibrate();
      setTimeout(clearPin, 500);
    }
  };

  const handleFingerprintVerification = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify Fingerprint',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        setMessage('Fingerprint Verified!');
        setTimeout(() => navigation.navigate('ChangePin'), 300);
      } else {
        setMessage('Fingerprint Authentication Failed.');
        Vibration.vibrate();
      }
    } else {
      setMessage('Fingerprint Authentication Not Available.');
      Vibration.vibrate();
    }
  };

  return (
    <VStack className="flex-1 bg-white px-6" style={{ height }}>
      {/* Top Section - Title */}
      <VStack className="mt-20 items-center">
        <Text className="text-3xl font-bold text-gray-900">Enter Current PIN</Text>
        <Text className="mt-2 text-gray-500">Verify your identity</Text>
      </VStack>

      {/* Middle Section - PIN Indicator */}
      <HStack className="mt-12 justify-center gap-4">
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            className={`h-5 w-5 rounded-full border border-gray-400 ${
              pin.length > i ? `bg-button-${appliedTheme}` : 'bg-white'
            }`}
          />
        ))}
      </HStack>

      {/* Bottom Section - Numpad */}
      <VStack className="flex-1 justify-center gap-6 space-y-4 pb-10">
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ['del', 0, 'fingerprint'],
        ].map((row, rowIndex) => (
          <HStack key={rowIndex} className="justify-center gap-6">
            {row.map((num, index) => (
              <Button
                key={index}
                className="h-20 w-20 items-center justify-center rounded-full border border-black bg-white"
                onPress={() => {
                  if (typeof num === 'number') {
                    setPin(num.toString(), handlePinVerification);
                  }
                  if (num === 'del') deleteLastDigit();
                  if (num === 'fingerprint') handleFingerprintVerification();
                }}>
                {num === 'fingerprint' ? (
                  <IC_Fingerprint className="text-2xl text-button-light" />
                ) : (
                  <Text className="text-2xl font-bold text-button-light">
                    {num === 'del' ? '⌫' : num}
                  </Text>
                )}
              </Button>
            ))}
          </HStack>
        ))}
      </VStack>

      {/* Status Message */}
      <VStack className="items-center pb-6">
        {message && (
          <Text className={message.includes('Verified') ? 'text-green-500' : 'text-red-500'}>
            {message}
          </Text>
        )}
      </VStack>
    </VStack>
  );
};

export default EnterChangePinScreen;
