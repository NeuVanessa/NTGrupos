import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
const ChatList = ({data, deleteRoom, userStatus}) => {
  const navigation = useNavigation();

  const openChat = () => {
    if (userStatus) {
      return navigation.navigate('Messages', {thread: data});
    }
    navigation.navigate('SignIn', {id: data});
  };
  return (
    <TouchableOpacity
      onLongPress={() => deleteRoom && deleteRoom()}
      onPress={openChat}>
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.nameText} numberOfLines={1}>
              {data.name}
            </Text>
          </View>
          <Text style={styles.contentText} numberOfLines={1}>
            {data.lastMessage.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 240, 245, .5)',
    marginVertical: 4,
  },
  content: {
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
  },
  contentText: {
    color: '#c1c1c1',
    fontSize: 16,
    marginTop: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
