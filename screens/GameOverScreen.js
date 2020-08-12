import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import fonts from '../constants/fonts';

export default props => {
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
  const [imageScale, setImageScale] = useState(Dimensions.get('window').width < Dimensions.get('window').height ? 0.7 : 0.2);

  useEffect(() => {
    const updateLayout = () => setAvailableDeviceWidth(Dimensions.get('window').width);
    Dimensions.addEventListener('change', updateLayout)
    return () => Dimensions.removeEventListener('change', updateLayout)
  })

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    if (width < height) {
      setImageScale(0.7)
    } else {
      setImageScale(0.2)
    }
  }, [availableDeviceWidth])

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.screen}>
        <Text style={fonts.heading}>Game Over</Text>
        <View style={{
          ...styles.imageContainer,
          borderRadius: availableDeviceWidth / 2,
          width: availableDeviceWidth * imageScale,
          height: availableDeviceWidth * imageScale,
        }}>
          <Image
            source={require('../assets/images/success.png')}
            fadeDuration={500}
            style={styles.image}
            resizeMode='cover'
          />
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>It took your phone {props.rounds} rounds to guess the correct number.</Text>
        </View>
        <View style={styles.actionsContainer}>
          <PrimaryButton onPress={props.onStartOver}>Start Over</PrimaryButton>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  imageContainer: {
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 3,
    marginVertical: Dimensions.get('window').height / 60
  },
  image: {
    width: '100%',
    height: '100%'
  },
  summaryContainer: {
    marginVertical: Dimensions.get('window').height / 60,
    marginHorizontal: Dimensions.get('window').height / 80
  },
  summaryText: {
    fontSize: 24,
    textAlign: 'center'
  },
  actionsContainer: {
  }
});