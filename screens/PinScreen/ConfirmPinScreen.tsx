import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Vibration } from 'react-native';
import usePinStore from '../../context/pinStore';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import MyLinearGradient from '@/components/gradient/MyLinearGradient';
import { Props } from '@/types/NavigationTypes';
import { useTranslation } from 'react-i18next';
import BackHeader from '@/components/BackHeader';

const ConfirmPinScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { clearPin } = usePinStore();
  const { appliedTheme } = useTheme();

  const { createdPin } = route.params;
  const [enteredPin, setEnteredPin] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!createdPin) {
      setMessage(t('confirmPin.noPinError'));
    }
  }, [createdPin, enteredPin]);

  useEffect(() => {
    if (enteredPin.length === 4) {
      handlePinConfirmation();
    }
  }, [enteredPin]);

  const handlePinPress = (digit: string) => {
    if (digit === '<') {
      setEnteredPin((prev) => prev.slice(0, -1));
    } else if (enteredPin.length < 4) {
      setEnteredPin((prev) => prev + digit);
    }
  };

  const handlePinConfirmation = () => {
    if (enteredPin === createdPin) {
      setMessage(t('confirmPin.success'));
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'TouchId' }],
        });
        setTimeout(() => clearPin(), 200);
      }, 500);
    } else {
      setMessage(t('confirmPin.failure'));
      Vibration.vibrate();
      setTimeout(() => setEnteredPin(''), 300);
    }
  };

  return (
    <MyLinearGradient type="background" color={appliedTheme === 'dark' ? 'dark' : 'light-blue'}>
      <Box className="flex h-full p-4">
        <BackHeader />

        <VStack className="flex-1 items-center justify-between">
          {/* Title */}
          <VStack className="items-center">
            <Text className={`text-3xl font-bold text-text-${appliedTheme}`}>
              {t('confirmPin.title')}
            </Text>
            <Text className={`text-subText-${appliedTheme} mt-2`}>{t('confirmPin.subtitle')}</Text>
          </VStack>

          {/* PIN Display */}
          <HStack className="justify-center gap-4">
            {[0, 1, 2, 3].map((index) => (
              <Box
                key={index}
                className={`flex h-16 w-14 items-center justify-center rounded-lg border-2 bg-card-${appliedTheme} ${
                  enteredPin.length === index
                    ? appliedTheme === 'dark'
                      ? 'border-white'
                      : 'border-purple-500'
                    : 'border-transparent'
                }`}>
                {enteredPin.length > index && (
                  <Box
                    className={`h-3 w-3 ${appliedTheme === 'light' ? 'bg-purple-500' : 'bg-white'} rounded-full`}
                  />
                )}
              </Box>
            ))}
          </HStack>

          {/* Number Pad */}
          <VStack className="mt-6 space-y-6">
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['', '0', '<'],
            ].map((row, rowIndex) => (
              <HStack key={rowIndex} className="justify-center gap-14">
                {row.map((digit, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePinPress(digit)}
                    className="flex h-20 w-20 items-center justify-center rounded-lg">
                    <Text className={`text-3xl font-semibold text-text-${appliedTheme}`}>
                      {digit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </HStack>
            ))}
          </VStack>

          {/* Status Message */}
          <Box className="mt-4">
            {message && (
              <Text
                className={`${message.includes(t('confirmPin.success')) ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </Text>
            )}
          </Box>
        </VStack>
      </Box>
    </MyLinearGradient>
  );
};

export default ConfirmPinScreen;
