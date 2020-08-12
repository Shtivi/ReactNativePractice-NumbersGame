import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import Card from '../components/Card';
import NumberContainer from '../components/NumberContainer';
import PrimaryButton from '../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  const random = Math.floor(Math.random() * (max - min)) + min;
  if (random == exclude) {
    return generateRandomBetween(min, max, exclude);
  }

  return random;
}

export default props => {
  const initalGuess = useState(generateRandomBetween(1, 100, props.userChoice));
  const [currentGuess, setCurrentGuess] = initalGuess;
  const [pastGuesses, setPassGuesses] = useState([]);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get('window');
      setAvailableDeviceWidth(width);
      setAvailableDeviceHeight(height);
    }

    Dimensions.addEventListener('change', updateLayout)
    return () => Dimensions.removeEventListener('change', updateLayout)
  })

  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props;

  useEffect(() => {
    if (currentGuess === userChoice) {
      onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver])

  const nextGuessHandler = direction => {
    if ((direction === 'lower' && currentGuess < props.userChoice) ||
      (direction === 'greater' && currentGuess > props.userChoice)) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [{
        text: 'Sorry!', style: 'cancel'
      }])
      return;
    }

    if (direction === 'lower') {
      currentHigh.current = currentGuess;
    }
    else if (direction === 'greater') {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
    setCurrentGuess(nextNumber);
    setPassGuesses(pastGuesses => [currentGuess, ...pastGuesses])
  }

  if (availableDeviceHeight < 550) {
    return (
      <View style={styles.screen}>
        <Text>Opponent's guess</Text>
        <View style={styles.horizontalControlsContainer}>
          <PrimaryButton onPress={() => nextGuessHandler('lower')}>
            <Ionicons name="md-arrow-down" size={24} color="white" />
          </PrimaryButton>
          <View style={styles.guessContainerHorizontal}>
            <NumberContainer>
              {currentGuess}
            </NumberContainer>
          </View>
          <PrimaryButton onPress={() => nextGuessHandler('greater')}>
            <Ionicons name="md-arrow-up" size={24} color="white" />
          </PrimaryButton>
        </View>
        <View style={styles.guessListContainer}>
          <ScrollView contentContainerStyle={styles.guessList}>
            {pastGuesses.map(guess => (
              <View
                key={guess}
                style={styles.guessListItem}>
                <Text>{guess}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <Text>Opponent's guess</Text>
      <View style={styles.guessContainer}>
        <NumberContainer>
          {currentGuess}
        </NumberContainer>
      </View>
      <Card style={styles.actionsContainer}>
        <PrimaryButton onPress={() => nextGuessHandler('lower')}>
          <Ionicons name="md-arrow-down" size={24} color="white" />
        </PrimaryButton>
        <PrimaryButton onPress={() => nextGuessHandler('greater')}>
          <Ionicons name="md-arrow-up" size={24} color="white" />
        </PrimaryButton>
      </Card>
      <View style={styles.guessListContainer}>
        <ScrollView contentContainerStyle={styles.guessList}>
          {pastGuesses.map(guess => (
            <View
              key={guess}
              style={styles.guessListItem}>
              <Text>{guess}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 30,
    alignItems: 'center'
  },
  guessContainer: {
    marginVertical: Dimensions.get('window').height > 600 ? 20 : 10
  },
  guessContainerHorizontal: {
    marginHorizontal: 20
  },
  horizontalControlsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '80%',
    minWidth: 300,
    maxWidth: '95%',
    justifyContent: 'space-around',
  },
  guessListContainer: {
    flex: 1,
    width: Dimensions.get('window').width > 400 ? '60%' : '95%'
  },
  guessList: {
    flexGrow: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  guessListItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  }
})