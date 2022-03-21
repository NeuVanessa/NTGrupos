import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

const FabButton = ({setVisible, userStatus}) => {
  const navigation = useNavigation();
  const handleNavigateButton = () => {
    userStatus ? setVisible() : navigation.navigate('SignIn');
  };
  return (
    <TouchableOpacity
      style={styles.containerButton}
      activeOpacity={0.8}
      onPress={handleNavigateButton}>
      <View>
        <Text style={styles.text}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FabButton;

const styles = StyleSheet.create({
  containerButton: {
    backgroundColor: '#2e54d4',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '5%',
    right: '6%',
  },
  text: {
    lineHeight: 0,
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
